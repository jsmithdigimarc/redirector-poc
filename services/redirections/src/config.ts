import type { Config } from "./types";

export function loadConfigFromProcessEnv(): Config {
  const missingKeys: string[] = [];
  let port: number = 8080;
  const portEnv = process.env.PORT;

  if (portEnv) {
    port = parseInt(portEnv, 10);
  }

  const actionsServiceUrl = process.env.ACTIONS_SERVICE_URL;
  const rulesServiceUrl = process.env.RULES_SERVICE_URL;
  const graphqlServiceUrl = process.env.GRAPHQL_SERVICE_URL;

  if (!actionsServiceUrl) {
    missingKeys.push("ACTIONS_SERVICE_URL");
  }

  if (!rulesServiceUrl) {
    missingKeys.push("RULES_SERVICE_URL");
  }

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
    actionsServiceUrl,
    // @ts-ignore - explicit undefined check performed above
    rulesServiceUrl,
    // @ts-ignore - explicit undefined check performed above
    graphqlServiceUrl,
  };
}
