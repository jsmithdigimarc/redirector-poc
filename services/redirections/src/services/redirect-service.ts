import type { Client as UrqlClient } from "@urql/core";
import { ActionsClient } from "../clients/actions-client";
import { RulesClient } from "../clients/rules-client";
import type { Action, Product, Redirect, Rule, Thng } from "../types";

export interface RedirectService {
  create(redirect: Redirect): Promise<string>;
  getRedirect(shortcode: string): Promise<string>;
}

export class RedirectNotFoundError extends Error {
  constructor(shortCode: string) {
    super(`No redirect found for shortcode ${shortCode}.`);
  }
}

const CREATE_REDIRECT_MUTATION = `mutation CreateRedirect($input: CreateRedirectInput!) {
    createRedirect(input: $input) {
      redirect {
        shortCode
      }
    }
  }`;

const GET_REDIRECT_QUERY = `query Redirect($shortCode: String!) {
    redirectByShortCode(shortCode: $shortCode) {
      id
      shortCode
      shortDomain
      defaultRedirectUrl
      evrythngId
      evrythngType
    }
  }`;

const GET_REDIRECT_META_QUERY = `query RedirectMeta($evrythngId: BigInt!) {
  productById(id: $evrythngId) {
    name
    id
    tags
  }
  thngById(id: $evrythngId) {
    name
    id
    tags
  }
  allRules {
    nodes {
      id
      weight
      name
      match
      meta
    }
  }
}`;

export function RedirectService(
  urqlClient: UrqlClient,
  rulesClient: RulesClient,
  actionsClient: ActionsClient
): RedirectService {
  async function create(redirect: Redirect): Promise<string> {
    const result = await urqlClient
      .mutation(CREATE_REDIRECT_MUTATION, {
        input: {
          redirect,
        },
      })
      .toPromise();

    if (result.error) {
      throw new Error(result.error.toString());
    }

    return result.data?.createRedirect.redirect.shortCode;
  }

  async function getRedirect(shortCode: string): Promise<string> {
    const getRedirectResult = await urqlClient
      .query(GET_REDIRECT_QUERY, { shortCode })
      .toPromise();

    if (getRedirectResult.error) {
      throw new Error(getRedirectResult.error.toString());
    }

    const redirect: Redirect | null =
      getRedirectResult.data.redirectByShortCode;

    if (!redirect) {
      throw new RedirectNotFoundError(shortCode);
    }

    const getRedirectMetaResult = await urqlClient
      .query(GET_REDIRECT_META_QUERY, {
        evrythngId: redirect.evrythngId,
      })
      .toPromise();

    if (getRedirectMetaResult.error) {
      throw new Error(getRedirectMetaResult.error.toString());
    }

    const product: Product | null = getRedirectMetaResult.data.productById;
    const thng: Thng | null = getRedirectMetaResult.data.thngById;
    const rules: Rule[] | null = getRedirectMetaResult.data.allRules.nodes;

    // @ts-ignore
    const action: Action = {
      product: {
        productId: redirect.evrythngId,
        type: "scan",
      },
      thng: {
        thngId: redirect.evrythngId,
        type: "scan",
      },
    }[redirect.evrythngType];

    // This is an async call, but we don't need to await the results. We are
    // being optimistic that the call to createAction succeeds, but whether or
    // not the API call succeeds doesn't matter for the context of a redirect.
    actionsClient.createAction({ action });

    if (!rules || rules.length === 0) {
      return redirect.defaultRedirectUrl;
    }

    const evaluateRulesResponse = await rulesClient.evaluateRules({
      rules: rules,
      payload: {
        product,
        thng,
        action,
      },
    });

    if (evaluateRulesResponse.rules.length === 0) {
      return redirect.defaultRedirectUrl;
    }

    return evaluateRulesResponse.rules.sort((a, b) => a.weight - b.weight)[0]
      .redirectUrl;
  }

  return {
    create,
    getRedirect,
  };
}
