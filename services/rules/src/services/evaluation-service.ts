import { Engine } from "json-rules-engine";
import type { Rule } from "../types";
import { RuleParser } from "../infrastructure/rule-parser";

const RULES_ENGINE_EVENT_NAME = "match";

export interface EvaluationService {
  evaluate(rules: Rule[], payload: any): Promise<Rule[]>;
}

export function EvaluationService(): EvaluationService {
  const parser = RuleParser();

  async function evaluateRules(rules: Rule[], payload: any): Promise<Rule[]> {
    const engine = new Engine();

    for (const rule of rules) {
      const condition = parser.parseMatchIntoRulesEngineCondition(rule.match);

      engine.addRule({
        conditions: condition,
        event: {
          type: RULES_ENGINE_EVENT_NAME,
          params: {
            rule,
          },
        },
      });
    }

    const { events } = await engine.run({
      input: payload,
    });

    if (events.length > 0) {
      return events
        .filter((e) => e.type === RULES_ENGINE_EVENT_NAME)
        .map((e) => e.params?.rule);
    }

    return [];
  }

  return {
    evaluate: evaluateRules,
  };
}
