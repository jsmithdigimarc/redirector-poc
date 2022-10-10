import { EvrythngClient } from "../clients/evrythng-client";
import { ActionsClient } from "../clients/actions-client";
import { RulesEngineClient } from "../clients/rules-engine-client";
import { Action } from "../types";

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
  rulesEngineClient: RulesEngineClient
): RedirectionsService {
  async function getRedirect(shortCode: string): Promise<string> {
    const getRedirectionResponse = await evrythngClient.getRedirection({ shortCode });

    if (!getRedirectionResponse.data.redirection) {
      throw new RedirectNotFoundError(shortCode);
    }

    const {
      data: {
        redirection
      }
    } = getRedirectionResponse;


    const getRedirectMetaResponse = await evrythngClient.getRedirectMeta({
      accountId: redirection.accountId,
      evrythngId: redirection.thngId || redirection.productId
    });

    const action: Action = {
      id: "",
      productId: redirection.productId,
      thngId: redirection.thngId,
      type: "scan"
    };

    await actionsClient.createAction({ action });

    if (!getRedirectMetaResponse.data.rules) {
      return redirection.defaultRedirectUrl;
    }

    const evaluateRulesResponse = await rulesEngineClient.evaluateRules({
      rules: getRedirectMetaResponse.data.rules,
      payload: {
        thng: getRedirectMetaResponse.data.thng,
        product: getRedirectMetaResponse.data.product,
        action
      }
    });

    if (evaluateRulesResponse.rules.length === 0) {
      return redirection.defaultRedirectUrl;
    }

    return evaluateRulesResponse.rules.sort((a, b) => a.weight - b.weight)[0].redirectUrl;
  }

  return {
    getRedirect
  };
}
