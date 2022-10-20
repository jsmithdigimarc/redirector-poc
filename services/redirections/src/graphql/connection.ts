import {
  Client,
  makeOperation,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { fetchIDToken } from "./auth";

export function createConnection(base: string, name: string): Client {
  // TODO: this function is fetching an auth token every time a graphql request
  // is made. There is the potential for some optimization here.
  const getAuth = async () => {
    const token = await fetchIDToken(base);
    return { token };
  };

  const addAuthToOperation = ({ authState, operation }: any) => {
    if (!authState || !authState.token) {
      return operation;
    }

    const fetchOptions =
      typeof operation.context.fetchOptions === "function"
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${authState.token}`,
        },
      },
    });
  };

  return createClient({
    url: new URL(name, base).toString(),
    exchanges: [
      // Ordering of exchanges matters. Synchronous exchanges (such as cache)
      // must come before asynchronous exchanges (such as auth).
      dedupExchange,
      cacheExchange,
      authExchange<{ token: string }>({
        getAuth,
        addAuthToOperation,
      }),
      fetchExchange,
    ],
    // Network only forces urql to ignore the cache and always make a request
    requestPolicy: "network-only",
  });
}
