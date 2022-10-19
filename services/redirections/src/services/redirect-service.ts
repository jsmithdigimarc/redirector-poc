import type { Client as UrqlClient } from "@urql/core";
import { ActionsClient } from "../clients/actions-client";
import { EvaluateRulesResponse, RulesClient } from "../clients/rules-client";
import type { Action, Product, Redirect, Rule, Thng, EvrythngType } from "../types";
import { QUERIES, MUTATIONS } from "../graphql";

// RedirectMeta represents the payload that will be sent to the rules engine to
// determine if/which redirect url to return.
type RedirectMeta = {
  rules: Rule[] | null;
  evrythngType: "PRODUCT";
  product: Product | null;
} | {
  rules: Rule[] | null;
  evrythngType: "THNG";
  thng: Thng | null;
}

export interface RedirectService {
  create(redirect: Redirect): Promise<string>;

  getRedirect(shortcode: string): Promise<string>;
}

export class RedirectNotFoundError extends Error {
  constructor(shortCode: string) {
    super(`No redirect found for shortcode ${shortCode}.`);
  }
}

export function RedirectService({
                                  urqlClient,
                                  rulesClient,
                                  actionsClient
                                }: {
  urqlClient: UrqlClient,
  rulesClient: RulesClient,
  actionsClient: ActionsClient
}): RedirectService {
  async function create(redirect: Redirect): Promise<string> {
    const result = await urqlClient
      .mutation(MUTATIONS.CREATE_REDIRECT, {
        input: {
          redirect
        }
      })
      .toPromise();

    if (result.error) {
      throw new Error(result.error.toString());
    }

    return result.data?.createRedirect.redirect.shortCode;
  }

  /**
   * getRedirect fetches a redirect for a shortcode, taking into account
   * Redirector rules that the account has configured.
   *
   * The function first fetches a Redirect from Postgraphile. Then using the
   * everythngType and evrythngId ofrom the Redirect it fetches the Product or
   * Thng the redirect belongs to, as well as the Redirector rules for the
   * account. The function then creates a scans action for the Product or Thng.
   *
   * If no account rules were found the defaultRedirectUrl of the Redirect is
   * returned. Otherwise, the Rules service is called with the account rules,
   * and a payload comprised of the Product or Thng, the Action, and the
   * original HTTP request.
   *
   * The Rules service will parse and execute the rules against the payload. If
   * no rules pass evaluation the defaultRedirectUrl is returned. If one or more
   * rules pass evaluation the rule with the highest weight has its redirectUrl
   * returned.
   * @param shortCode
   */
  async function getRedirect(shortCode: string): Promise<string> {
    const redirect = await loadRedirectFromPostgraphile(shortCode);
    const redirectMeta = await loadRedirectMetaFromPostgraphile(
      redirect.evrythngType,
      redirect.evrythngId
    );

    const action: Action = {
      type: "scan",
      evrythngType: redirect.evrythngType,
      evrythngId: redirect.evrythngId
    };

    // This is an async call, but we don't need to await the results. We are
    // being optimistic that the call to createAction succeeds, but whether the
    // API call succeeds doesn't matter for the context of a redirect.
    //
    // In a production app we may also replace this call with a call to a queue
    // that way the ActionService has the ability to retry creation of the action
    // multiple times.
    actionsClient.createAction({ action });

    // If this account has no rules to evaluate, return the defaultRedirectUrl.
    if (!redirectMeta.rules || redirectMeta.rules.length === 0) {
      return redirect.defaultRedirectUrl;
    }

    let evaluateResponse: EvaluateRulesResponse;

    switch (redirectMeta.evrythngType) {
      case "PRODUCT":
        evaluateResponse = await rulesClient.evaluateRules({
          rules: redirectMeta.rules,
          payload: {
            product: redirectMeta.product,
            action
          }
        });
        break;
      case "THNG":
        evaluateResponse = await rulesClient.evaluateRules({
          rules: redirectMeta.rules,
          payload: {
            thng: redirectMeta.thng,
            action
          }
        });
        break;
    }

    // If no rules passed evaluation return the defaultRedirectUrl.
    if (!evaluateResponse || evaluateResponse.length === 0) {
      return redirect.defaultRedirectUrl;
    }

    // If one or more rules passed figure out which rule has the highest weight.
    const sortedRules = evaluateResponse.sort((a, b) => {
      let aWeight = parseInt(a.weight, 10);
      let bWeight = parseInt(b.weight, 10);
      if (isNaN(aWeight)) {
        aWeight = 0;
      }
      if (isNaN(bWeight)) {
        bWeight = 0;
      }
      return bWeight - aWeight
    });

    console.log("sortedRules ", sortedRules);

    const winningRule = sortedRules[0];

    // Parse the meta property (which is stored as a JSON string in Postgres)
    // to retrieve the redirectUrl.
    const {
      redirectUrl
    } = JSON.parse(winningRule.meta);

    return redirectUrl;
  }

  async function loadRedirectFromPostgraphile(shortCode: string): Promise<Redirect> {
    const getRedirectResult = await urqlClient
      .query(QUERIES.GET_REDIRECT, { shortCode })
      .toPromise();

    if (getRedirectResult.error) {
      throw new Error(getRedirectResult.error.toString());
    }

    const redirect: Redirect | null =
      getRedirectResult.data.redirectByShortCode;

    if (!redirect) {
      throw new RedirectNotFoundError(shortCode);
    }

    return redirect;
  }

  async function loadRedirectMetaFromPostgraphile(evrythngType: EvrythngType, evrythngId: string): Promise<RedirectMeta> {
    const getRedirectMetaResult = await urqlClient
      .query(QUERIES.GET_REDIRECT_META, {
        evrythngId
      })
      .toPromise();

    if (getRedirectMetaResult.error) {
      throw new Error(getRedirectMetaResult.error.toString());
    }


    switch (evrythngType) {
      case "PRODUCT":
        return {
          evrythngType,
          product: {
            ...getRedirectMetaResult.data?.productById,
            customFields: JSON.parse(getRedirectMetaResult.data?.productById?.customFields)
          },
          rules: getRedirectMetaResult.data?.allRules.nodes
        };
      case "THNG":
        return {
          evrythngType,
          thng: {
            ...getRedirectMetaResult.data?.thngById,
            customFields: JSON.parse(getRedirectMetaResult.data?.thngById?.customFields)
          },
          rules: getRedirectMetaResult.data?.allRules.nodes
        };
    }
  }

  return {
    create,
    getRedirect
  };
}

