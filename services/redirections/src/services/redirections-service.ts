import {EvrythngClient} from "../clients/evrythng-client";
import {ActionsClient} from "../clients/actions-client";
import {RulesEngineClient} from "../clients/rules-engine-client";

export interface RedirectionsService {
    getRedirect(shortcode: string): Promise<string>
}

export function RedirectionsService(
    evrythngClient: EvrythngClient,
    actionsClient: ActionsClient,
    rulesEngineClient: RulesEngineClient): RedirectionsService {

    async function getRedirect(shortcode: string): Promise<string> {
        const redirect = await evrythngClient.getRedirection(shortcode);
        if (!redirect) {
            return ""
        }

        const meta = await evrythngClient.getRedirectMeta(redirect.accountId, redirect.thngId || redirect.productId)
        if (!meta) {
            return ""
        }
        const action = await actionsClient.create({});

        const rules = await rulesEngineClient.evaluate(meta.rules, {
            ...meta,
            action
        })

        return rules.sort((a, b) => a.weight - b.weight)[0].redirectUrl;
    }

    return {
        getRedirect,
    };
}
