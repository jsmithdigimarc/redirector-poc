import type { Action } from "../types";

export interface ActionsClient {
  create(action: Action): Promise<Action>;
}

export function ActionsClient(base: string): ActionsClient {
  async function create(action: Action): Promise<Action> {
    return {};
  }

  return {
    create,
  };
}
