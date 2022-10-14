import type { Client as UrqlClient } from "@urql/core";
import type { Rule } from "../types";

/**
 * RulesService provides create, update and delete operations on Rules. All reads
 * are done from the GraphQL service.
 */
export interface RulesService {
  createRule(rule: Rule): Promise<string>;
  updateRule(rule: Rule): Promise<string>;
  deleteRule(id: string): Promise<void>;
}

const CREATE_RULE_MUTATION = `mutation CreateRule($input: CreateRuleInput!) {
      createRule(input: $input) {
        rule {
          id
        }
      }
    }`;

const UPDATE_RULE_MUTATION = `mutation UpdateRule($input: UpdateRuleByIdInput!) {
      updateRuleById(input: $input) {
        rule {
          id
        }
      }
    }`;

const DELETE_RULE_MUTATION = `mutation DeleteRule($input: DeleteRuleByIdInput!) {
      deleteRuleById(input: $input) {
        rule {
          id
        }
      }
    }`;

export function RulesService(urqlClient: UrqlClient): RulesService {
  async function createRule(rule: Rule): Promise<string> {
    const result = await urqlClient
      .mutation(CREATE_RULE_MUTATION, {
        input: {
          rule,
        },
      })
      .toPromise();

    if (result.error) {
      throw new Error(result.error.toString());
    }

    return result.data?.createRule.rule.id;
  }

  async function updateRule(rule: Rule): Promise<string> {
    const result = await urqlClient
      .mutation(UPDATE_RULE_MUTATION, {
        input: {
          id: rule.id,
          rulePatch: rule,
        },
      })
      .toPromise();

    if (result.error) {
      throw new Error(result.error.toString());
    }

    return result.data?.updateRuleById.rule.id;
  }

  async function deleteRule(id: string): Promise<void> {
    const result = await urqlClient
      .mutation(DELETE_RULE_MUTATION, {
        input: {
          id,
        },
      })
      .toPromise();

    if (result.error) {
      throw new Error(result.error.toString());
    }
  }

  return {
    createRule,
    updateRule,
    deleteRule,
  };
}
