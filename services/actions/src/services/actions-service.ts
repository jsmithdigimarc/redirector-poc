import type { Action } from "../types";

export interface ActionsService {
  create(action: Action): Promise<string>;
}

export function ActionsService(): ActionsService {

  async function create(action: Action): Promise<string> {
    return "";
  }

  return {
    create,
  };
}
