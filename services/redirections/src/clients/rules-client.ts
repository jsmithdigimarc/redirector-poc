import { GoogleAuth } from "google-auth-library";
import type { Rule } from "../types";

export interface RulesClient {
  evaluateRules(request: EvaluateRulesRequest): Promise<EvaluateRulesResponse>;
}

export type EvaluateRulesRequest = {
  rules: Rule[];
  payload: any;
};

export type EvaluateRulesResponse = Rule[];

export function RulesClient(base: string): RulesClient {
  const auth = new GoogleAuth();

  async function evaluateRules(
    request: EvaluateRulesRequest
  ): Promise<EvaluateRulesResponse> {
    const client = await auth.getIdTokenClient(base);
    const response = await client.request({
      url: `${base}/evaluate`,
      method: "POST",
      data: request,
    });

    return <EvaluateRulesResponse>response.data;
  }

  return {
    evaluateRules,
  };
}
