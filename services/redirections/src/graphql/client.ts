import { URL } from "node:url";
import {
  Client,
  createClient as createURQLClient,
  makeOperation,
  dedupExchange,
  fetchExchange,
  cacheExchange,
} from "@urql/core";
import { authExchange } from "@urql/exchange-auth";

const GCP_METADATA_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

export function createClient(base: string): Client {
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

  return createURQLClient({
    url: base,
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

async function fetchIDToken(audience: string): Promise<string> {
  const metadataUrl = new URL(GCP_METADATA_URL);
  metadataUrl.searchParams.append("audience", audience);

  const response = await fetch(metadataUrl, {
    method: "GET",
    headers: {
      "Metadata-Flavor": "Google",
    },
  });

  if (response.status !== 200) {
    const error = await response.text();
    throw new Error(
      `failed to fetch identity token from gcp metadata server: ${error}`
    );
  }

  return await response.text();
}
