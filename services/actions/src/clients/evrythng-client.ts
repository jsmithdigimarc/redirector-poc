import type { Action } from "../types";
import { GoogleAuth } from "google-auth-library";

export interface EvrythngClient {
  createAction(request: CreateActionRequest): Promise<CreateActionResponse>;
}

type GraphQLRequest =
  | {
      operationName: string;
      query: string;
    }
  | {
      operationName: string;
      mutation: string;
    };

type GraphQLResponse<T> = {
  errors: any[] | undefined;
  data: T;
};

export type CreateActionRequest = {
  action: Action;
};

export type CreateActionResponse = {
  action: Action | null;
};

export class EvrythngAPIError extends Error {
  errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);

    this.errors = errors;
  }
}

export function EvrythngClient(base: string, token: string): EvrythngClient {
  const auth = new GoogleAuth();

  const OPERATIONS = {
    CREATE_ACTION: "createAction",
  };

  const CREATE_ACTION_MUTATION = (action: Action) => `mutation ${
    OPERATIONS.CREATE_ACTION
  } {
  createAction(input: ${JSON.stringify(action)}) {
  }
}`;

  async function _doRequest<Res>(
    request: GraphQLRequest
  ): Promise<GraphQLResponse<Res>> {
    const client = await auth.getIdTokenClient(base);
    const response = await client.request<GraphQLResponse<Res>>({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: request,
      method: "POST",
    });

    if (response.status != 200 || response.data.errors) {
      // If the API returns a non 200 status code (e.g., 400), the result of the call is an array of errors
      // that are passed into the EvrythngAPIError to potentially be reported on further up the stack.
      throw new EvrythngAPIError(
        `failed to execute operation: ${request.operationName}`,
        response.data.errors || []
      );
    }

    return response.data;
  }

  async function createAction(
    request: CreateActionRequest
  ): Promise<CreateActionResponse> {
    const result = await _doRequest<CreateActionResponse>({
      operationName: OPERATIONS.CREATE_ACTION,
      mutation: CREATE_ACTION_MUTATION(request.action),
    });

    return result.data;
  }

  return {
    createAction,
  };
}
