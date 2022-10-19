import type { TopLevelCondition } from "json-rules-engine";
import type { Rule } from "../types";

export interface Parser<T> {
  parse(input: T): TopLevelCondition;
}

/**
 * Operator represents an operator that can be used to compare the left and right
 * side of an expression. Operators are supplied to json-rules-engine as part
 * of a condition definition.
 */
enum Operator {
  Equal = "equal",
  Like = "like",
  NotEqual = "notEqual",
  LessThan = "lessThan",
  LessThanInclusive = "lessThanInclusive",
  GreaterThan = "greaterThan",
  GreaterThanInclusive = "greaterThanInclusive",
  In = "in",
  NotIn = "notIn",
  Contains = "contains",
  DoesNotContain = "doesNotContain",
}

/**
 * Represents the FACT_NAME that will be attached to rules supplied to the Rules
 * Engine. The FACT_NAME represents the name of the object that rules are
 * evaluated against.
 * @constant
 * @type {string}
 */
const FACT_NAME: string = "input";

/**
 * Represents the regular expression used to parse a match into its individual
 * statements. Splits on '&' and '|' characters except those escaped with a '\\'.
 * @constant
 * @type {RegExp}
 */
const STATEMENT_REGEX: RegExp = /(&)(?<!\\&)|(\|)(?<!\\\|)/g;

/**
 * Represents the regular expression used to parse an individual statement into
 * its left hand, operator, and right hand sides. The regex uses a capture
 * group to ensure the operator is captured.
 * @constant
 * @type {RegExp}
 */
const OPERATION_REGEX: RegExp = /(!=~|=~|=|~|>=|>|<=|<|!\.\.|\.\.)/g;

/**
 * Represents a mapping between an operator token and the operator we will supply
 * to the rules engine. For example, an '=' token is transformed into 'equal'.
 * @constant
 * @type {{[key: string]: Operator}}
 */
const OPERATION_MAP: { [key: string]: Operator } = {
  "!=~": Operator.DoesNotContain,
  "=~": Operator.Contains,
  "=": Operator.Equal,
  "~": Operator.Like,
  ">=": Operator.LessThanInclusive,
  ">": Operator.LessThan,
  "<=": Operator.GreaterThanInclusive,
  "<": Operator.GreaterThan,
  "!..": Operator.NotIn,
  "..": Operator.In
};

/**
 * MatchParser returns a Parser<string> that accepts the match property from a
 * rule and attempts to parse it into a TopLevelCondition to be consumed by
 * json-rules-engine.
 * @param rule {Rule}
 * @returns {TopLevelCondition}
 */
export function MatchParser(): Parser<string> {
  return {
    parse(match: string): TopLevelCondition {
      let topLevelOperator = "&";
      const statements = match.split(STATEMENT_REGEX).filter((x) => !!x);

      if (statements.length > 1) {
        // if we start with an & or | remove it
        if (statements[0] === "&" || statements[0] === "|") {
          statements.shift();
        }

        // if we end with an & or | remove it
        if (
          statements[statements.length - 1] === "&" ||
          statements[statements.length - 1] === "|"
        ) {
          statements.pop();
        }

        if (statements.length % 2 === 0) {
          throw new Error(
            `invalid expression, attempting to use AND or OR operator without righthand value: ${match}`
          );
        }

        // quick and dirty check that we are only supporting all ands or all or's
        if (statements.length > 1) {
          const topLevelOperators = statements.filter((_, i) => i % 2 === 1);
          const allMatch = topLevelOperators.every((v, i, arr) => v === arr[0]);
          if (!allMatch) {
            throw new Error(
              `invalid expression, attempting to combine operators AND and OR: ${match}`
            );
          }
          topLevelOperator = topLevelOperators[0];
        }
      }

      const expressions = statements
        .filter((_, i) => i % 2 === 0)
        .map((ex) => ex.split(OPERATION_REGEX))
        .map((ex) => {
          return {
            fact: FACT_NAME,
            path: `$.${ex[0]}`,
            operator: OPERATION_MAP[ex[1]],
            value: ex[2]
          };
        });

      switch (topLevelOperator) {
        case "&":
          return {
            all: expressions
          };
        case "|":
          return { any: expressions };
        default:
          return { all: expressions };
      }
    }
  };
}
