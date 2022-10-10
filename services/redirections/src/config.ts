import type { Config } from "./types";

export function loadConfigFromProcessEnv(): Config {
  const missingKeys: string[] = [];
  let port: number = 8080;
  const portEnv = process.env.PORT;

  if (portEnv) {
    port = parseInt(portEnv, 10);
  }

  const graphileApiToken = process.env.GRAPHILE_API_TOKEN;
  const graphileBaseUrl = process.env.GRAPHILE_BASE_URL;
  const actionsServiceUrl = process.env.ACTIONS_SERVICE_URL;
  const rulesEngineServiceUrl = process.env.RULES_ENGINE_SERVICE_URL;

  if (!graphileBaseUrl) {
    missingKeys.push("GRAPHILE_API_TOKEN");
  }

  if (!graphileApiToken) {
    missingKeys.push("GRAPHILE_BASE_URL");
  }

  if (!actionsServiceUrl) {
    missingKeys.push("ACTIONS_SERVICE_URL");
  }

  if (!rulesEngineServiceUrl) {
    missingKeys.push("RULES_ENGINE_SERVICE_URL");
  }

  if (missingKeys.length > 0) {
    throw new Error(
      `The following environment variables are unset: ${missingKeys.join(", ")}`
    );
  }

  return {
    port,
    // @ts-ignore - explicit undefined check performed above
    graphileBaseUrl,
    // @ts-ignore - explicit undefined check performed above
    graphileApiToken,
    // @ts-ignore - explicit undefined check performed above
    actionsServiceUrl,
    // @ts-ignore - explicit undefined check performed above
    rulesEngineServiceUrl,
  };
}
