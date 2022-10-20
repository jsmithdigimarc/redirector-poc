import { EvrythngClient, RedirectClient } from "./clients";
import { createConnection } from "./connection";

const REDIRECT_PREFIX = "redirects";
const EVRYTHNG_PREFIX = "evrythng";

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

      if (client) {
        return client;
      }

      client = EvrythngClient(
        createConnection(base, `${EVRYTHNG_PREFIX}/${customerId}`)
      );

      CLIENT_CACHE.set(customerId, client);

      return client;
    },
    createRedirectClient() {
      if (REDIRECT_CLIENT) {
        return REDIRECT_CLIENT;
      }

      REDIRECT_CLIENT = RedirectClient(createConnection(base, REDIRECT_PREFIX));
      return REDIRECT_CLIENT;
    },
  };
}
