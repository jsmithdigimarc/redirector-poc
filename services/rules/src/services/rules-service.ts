import type { Client } from "@urql/core";
import type { Rule } from "../types";

export interface RulesService {
  createRule(rule: Rule): Promise<string>;
  readRule(id: string): Promise<Rule>;
  updateRule(rule: Rule): Promise<string>;
  deleteRule(id: string): Promise<void>;
  listRules(): Promise<Rule[]>;
}

export function RulesService(): RulesService {
  async function createRule(rule: Rule): Promise<string> {
    throw new Error("Not implemented");
  }

  async function readRule(id: string): Promise<Rule> {
    throw new Error("Not implemented");
  }

  async function updateRule(rule: Rule): Promise<string> {
    throw new Error("Not implemented");
  }

  async function deleteRule(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async function listRules(): Promise<Rule[]> {
    throw new Error("Not implemented");
  }

  return {
    createRule,
    readRule,
    updateRule,
    deleteRule,
    listRules,
  };
}
