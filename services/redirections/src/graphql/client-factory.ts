import { EvrythngClient, RedirectClient } from "./clients";
import { createConnection } from "./connection";

const REDIRECT_PREFIX = "redirects";
const CONSUMER_ENGAGEMENT_PREFIX = "consumerengagement";

export interface ClientFactory {
  createEvrythngClient(customerId: string): EvrythngClient;
  createRedirectClient(): RedirectClient;
}

export function ClientFactory(base: string): ClientFactory {
  let REDIRECT_CLIENT: RedirectClient;
  const CLIENT_CACHE = new Map<string, EvrythngClient>();

  return {
    createEvrythngClient(customerId) {
      let client = CLIENT_CACHE.get(customerId);
      if (!client) {
        client = EvrythngClient(
          createConnection(
            base,
            `${CONSUMER_ENGAGEMENT_PREFIX}/${customerId}/graphql`
          )
        );
        CLIENT_CACHE.set(customerId, client);
      }

      return client;
    },
    createRedirectClient() {
      if (!REDIRECT_CLIENT) {
        REDIRECT_CLIENT = RedirectClient(
          createConnection(base, `${REDIRECT_PREFIX}/graphql`)
        );
      }

      return REDIRECT_CLIENT;
    },
  };
}
