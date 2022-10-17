import { URL } from "node:url";
import {
  Client,
  createClient as createURQLClient,
  makeOperation,
} from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange } from "@urql/exchange-graphcache";

const GCP_METADATA_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

export function createClient(base: string): Client {
  async function getAuth({ authState }: any) {
    if (!authState) {
      const token = await fetchIDToken(base);
      return { token };
    }
    return null;
  }

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
          Authorization: authState.token,
        },
      },
    });
  };

  return createURQLClient({
    url: base,
    exchanges: [
      // Ordering of exchanges matters. Synchronous exchanges (such as cache)
      // must come before asynchronous exchanges (such as auth).
      cacheExchange({}),
      authExchange({
        getAuth,
        addAuthToOperation,
      }),
    ],
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
