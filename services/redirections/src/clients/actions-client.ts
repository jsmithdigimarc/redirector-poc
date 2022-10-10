import { GoogleAuth } from "google-auth-library";
import type { Action } from "../types";

export interface ActionsClient {
  createAction(request: CreateActionRequest): Promise<CreateActionResponse>;
}

export type CreateActionRequest = {
  action: Action;
};

export type CreateActionResponse = {
  action: Action;
};

export function ActionsClient(base: string): ActionsClient {
  const auth = new GoogleAuth();

  async function createAction(request: CreateActionRequest): Promise<CreateActionResponse> {
    const client = await auth.getIdTokenClient(base);
    const response = await client.request({
      url: "/",
      method: "POST",
      body: request
    });

    return <CreateActionResponse>response.data;
  }

  return {
    createAction
  };
}
