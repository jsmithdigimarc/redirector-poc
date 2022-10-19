import type { Rule } from "../types";
import type { RulesEngine } from "../rules-engine";

export interface EvaluationService {
  evaluateRules(rules: Rule[], payload: any): Promise<Rule[]>;
}

export function EvaluationService({ engine }: { engine: RulesEngine }): EvaluationService {
  return {
    async evaluateRules(rules: Rule[], payload: any): Promise<Rule[]> {
      return await engine.evaluate(rules, payload);
    }
  };
}