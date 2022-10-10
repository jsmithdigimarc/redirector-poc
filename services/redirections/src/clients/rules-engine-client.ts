import { GoogleAuth } from "google-auth-library";
import type { Rule } from "../types";

export interface RulesEngineClient {
  evaluateRules(request: EvaluateRulesRequest): Promise<EvaluateRulesResponse>;
}

export type EvaluateRulesRequest = {
  rules: Rule[],
  payload: any;
}

export type EvaluateRulesResponse = {
  rules: Rule[];
}

export function RulesEngineClient(base: string): RulesEngineClient {
  const auth = new GoogleAuth();

  async function evaluateRules(request: EvaluateRulesRequest): Promise<EvaluateRulesResponse> {
    const client = await auth.getIdTokenClient(base);
    const response = await client.request({
      url: "/",
      method: "POST",
      body: request
    });

    return <EvaluateRulesResponse>response.data;
  }

  return {
    evaluateRules
  };
}



