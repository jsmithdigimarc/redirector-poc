import type { TopLevelCondition } from "json-rules-engine";

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
 * statements. Expression splits on '&' and '|' characters except those escaped
 * with a '\\'.
 * @constant
 * @type {RegExp}
 */
const EXPRESSION_REGEX: RegExp = /(&)(?<!\\&)|(\|)(?<!\\\|)/g;

/**
 * Represents the regular expression used to parse an individual statement into
 * its left hand, operator, and right hand sides. The expresion uses a capture
 * group to ensure the operator is captured.
 * @constant
 * @type {RegExp}
 */
const OPERATION_REGEX: RegExp = /(=|~|>|>=|<|<=|\.\.)/g;

/**
 * Represents a mapping between an operator token and the operator we will supply
 * to the rules engine. For example, an '=' token is transformed into 'equal'.
 * @constant
 * @type {{[key: string]: Operator}}
 */
const OPERATION_MAP: { [key: string]: Operator } = {
  "=": Operator.Equal,
  ">": Operator.LessThan,
  ">=": Operator.LessThanInclusive,
  "<": Operator.GreaterThan,
  "<=": Operator.GreaterThanInclusive,
  "~": Operator.Like,
};

/**
 * RuleParser returns a collection of functions for parsing rules into other
 * data formats.
 * @returns
 */
export function RuleParser() {
  /**
   * parseMatchIntoRulesEngineCondition accepts a string from a rule and attempts
   * to parse it into a TopLevelCondition to be consumed by json-rules-engine.
   * @param match {string}
   * @returns {TopLevelCondition}
   */
  function parseMatchIntoRulesEngineCondition(
    match: string
  ): TopLevelCondition {
    let topLevelOperator = "&";
    const exprSplit = match.split(EXPRESSION_REGEX).filter((x) => !!x);

    if (exprSplit.length > 1) {
      // if we start with an & or | remove it
      if (exprSplit[0] === "&" || exprSplit[0] === "|") {
        exprSplit.shift();
      }

      // if we end with an & or | remove it
      if (
        exprSplit[exprSplit.length - 1] === "&" ||
        exprSplit[exprSplit.length - 1] === "|"
      ) {
        exprSplit.pop();
      }

      if (exprSplit.length % 2 === 0) {
        throw new Error(
          `invalid expression, attempting to use AND or OR operator without righthand value: ${match}`
        );
      }

      // quick and dirty check that we are only supporting all ands or all or's
      if (exprSplit.length > 1) {
        const topLevelOperators = exprSplit.filter((_, i) => i % 2 === 1);
        const allMatch = topLevelOperators.every((v, i, arr) => v === arr[0]);
        if (!allMatch) {
          throw new Error(
            `invalid expression, attempting to combine operators AND and OR: ${match}`
          );
        }
        topLevelOperator = topLevelOperators[0];
      }
    }

    const expressions = exprSplit
      .filter((_, i) => i % 2 === 0)
      .map((ex) => ex.split(OPERATION_REGEX))
      .map((ex) => {
        return {
          fact: FACT_NAME,
          path: `$.${ex[0]}`,
          operator: OPERATION_MAP[ex[1]],
          value: ex[2],
        };
      });

    switch (topLevelOperator) {
      case "&":
        return {
          all: expressions,
        };
      case "|":
        return { any: expressions };
      default:
        return { all: expressions };
    }
  }

  return {
    parseMatchIntoRulesEngineCondition,
  };
}
