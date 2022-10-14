import type { Config } from "./types";

export function loadConfigFromProcessEnv(): Config {
  const missingKeys: string[] = [];
  let port: number = 8080;
  const portEnv = process.env.PORT;

  if (portEnv) {
    port = parseInt(portEnv, 10);
  }

  const graphqlServiceUrl = process.env.GRAPHQL_SERVICE_URL;

  if (!graphqlServiceUrl) {
    missingKeys.push("GRAPHQL_SERVICE_URL");
  }

  if (missingKeys.length > 0) {
    throw new Error(
      `The following environment variables are unset: ${missingKeys.join(", ")}`
    );
  }

  return {
    port,
    // @ts-ignore - explicit undefined check performed above
    graphqlServiceUrl,
  };
}
