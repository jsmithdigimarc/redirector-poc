import type { Action, Rule } from "../types";

export interface RulesEngineClient {
  evaluate(rules: Rule[], payload: any): Promise<Rule[]>;
}

export function RulesEngineClient(base: string): RulesEngineClient {
  async function evaluate(rules: Rule[], payload: any): Promise<Rule[]> {
    return rules;
  }

  return {
    evaluate,
  };
}
