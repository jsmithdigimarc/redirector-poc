import POC_RULES from '../data/sample-rules.json';
import type {Product, Redirection, Rule, Thng} from "../types";

type RedirectMeta = {
    rules: Rule[]
    thng: Thng | null
    product: Product | null
}

export interface EvrythngClient {
    getRedirection(shortUrl: string): Promise<Redirection | null>;

    getRedirectMeta(accountId: string, evrythngId: string): Promise<RedirectMeta | null>;
}

export function EvrythngClient(base: string, token: string): EvrythngClient {
    async function getRedirection(shortUrl: string): Promise<Redirection | null> {
        const query = `query redirection {
          redirection(shortId: "${shortUrl}") {
            productId
            thngId
            defaultRedirectUrl
            shortDomain
            shortId
          }
        }`;

        const result = await fetch(base, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: query,
            method: 'POST',
            mode: "cors"
        })

        return <Redirection | null>await result.json();
    }

    async function getRedirectMeta(accountId: string, evrythngId: string): Promise<RedirectMeta | null> {
        // The GraphQL endpoint I am hitting does not return Rules, so I am hardcoding them for the POC
        const query = `query redirection {
          thng(id: "${evrythngId}") {
            id
            name
            location
            customFields
            description
            customFields
            tags
            properties
          }
          product(id: "${evrythngId}") {
            id
            name
            brand
            customFields
            tags
            description
            properties
          }
        }`;

        const response = await fetch(base, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: query,
            method: 'POST',
            mode: "cors"
        })

        const result = <RedirectMeta>await response.json();

        result.rules = POC_RULES;

        return result
    }

    return {
        getRedirection,
        getRedirectMeta
    };
}
