import type { EvrythngClient } from "../clients/evrythng-client";
import type { ActionsClient } from "../clients/actions-client";
import type { RulesClient } from "../clients/rules-client";
import type { Action } from "../types";

export interface RedirectionsService {
  getRedirect(shortcode: string): Promise<string>;
}

export class RedirectNotFoundError extends Error {
  constructor(shortCode: string) {
    super(`No redirect found for shortcode ${shortCode}.`);
  }
}

export function RedirectionsService(
  evrythngClient: EvrythngClient,
  actionsClient: ActionsClient,
  rulesClient: RulesClient
): RedirectionsService {
  async function getRedirect(shortCode: string): Promise<string> {
    const getRedirectionResponse = await evrythngClient.getRedirection({
      shortCode,
    });

    if (!getRedirectionResponse.redirection) {
      throw new RedirectNotFoundError(shortCode);
    }

    const { redirection } = getRedirectionResponse;

    const getRedirectMetaResponse = await evrythngClient.getRedirectMeta({
      accountId: redirection.accountId,
      evrythngId: redirection.thngId || redirection.productId,
    });

    const action: Action = {
      id: "",
      productId: redirection.productId,
      thngId: redirection.thngId,
      type: "scan",
    };

    await actionsClient.createAction({ action });

    if (!getRedirectMetaResponse.rules) {
      return redirection.defaultRedirectUrl;
    }

    const evaluateRulesResponse = await rulesClient.evaluateRules({
      rules: getRedirectMetaResponse.rules,
      payload: {
        thng: getRedirectMetaResponse.thng,
        product: getRedirectMetaResponse.product,
        action,
      },
    });

    if (evaluateRulesResponse.rules.length === 0) {
      return redirection.defaultRedirectUrl;
    }

    return evaluateRulesResponse.rules.sort((a, b) => a.weight - b.weight)[0]
      .redirectUrl;
  }

  return {
    getRedirect,
  };
}
