import { Engine } from "json-rules-engine";
import type { Rule } from "../types";
import { RuleParser } from "../infrastructure/rule-parser";

const EVENT_TYPE_MATCH = "match";

export interface RulesService {
  evaluateRules(rules: Rule[], payload: any): Promise<Rule[]>;
}

export function RulesService(): RulesService {
  const parser = RuleParser();

  async function evaluateRules(rules: Rule[], payload: any): Promise<Rule[]> {
    const engine = new Engine();

    for (const rule of rules) {
      const condition = parser.parseMatchIntoRulesEngineCondition(rule.match);

      engine.addRule({
        conditions: condition,
        event: {
          type: EVENT_TYPE_MATCH,
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
        .filter((e) => e.type === EVENT_TYPE_MATCH)
        .map((e) => e.params?.rule);
    }

    return [];
  }

  return {
    evaluateRules,
  };
}
