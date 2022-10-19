import { Engine as JsonRulesEngine } from "json-rules-engine";
import type { Rule } from "../types";
import type { Parser } from "./parsers";

const EVENT_MATCH = "match";

export interface RulesEngine {
  evaluate(rules: Rule[], payload: any): Promise<Rule[]>;
}

export function RulesEngine(parser: Parser<string>): RulesEngine {
  async function evaluate(rules: Rule[], payload: any): Promise<Rule[]> {
    const engine = new JsonRulesEngine();

    for (const rule of rules) {
      const condition = parser.parse(rule.match);
      console.log("MATCH: ", rule.match);
      console.log(condition);

      engine.addRule({
        conditions: condition,
        event: {
          type: EVENT_MATCH,
          params: {
            rule
          }
        }
      });
    }

    console.log("PAYLOAD");
    console.log(payload);

    const { events } = await engine.run({
      input: payload
    });

    if (events.length > 0) {
      return events
        .filter((e) => e.type === EVENT_MATCH)
        .map((e) => e.params?.rule);
    }

    return [];
  }

  return {
    evaluate
  };
}
