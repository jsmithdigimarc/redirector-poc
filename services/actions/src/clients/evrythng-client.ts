import type { Action } from "../types";

export interface EvrythngClient {
  createAction(request: CreateActionRequest): Promise<CreateActionResponse>;
}

type GraphQLRequest = {
  operationName: string,
  query: string
} | {
  operationName: string;
  mutation: string;
}

type GraphQLResponse<T> = {
  errors: any[] | undefined;
  data: T
}

export type CreateActionRequest = {
  action: Action;
}

export type CreateActionResponse = GraphQLResponse<{
  action: Action | null;
}>

export class EvrythngAPIError extends Error {
  errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);

    this.errors = errors;
  }
}

export function EvrythngClient(base: string, token: string): EvrythngClient {
  const OPERATIONS = {
    CREATE_ACTION: "createAction"
  };

  const CREATE_ACTION_MUTATION = (action: Action) => `mutation ${OPERATIONS.CREATE_ACTION} {
  createAction(input: ${JSON.stringify(action)}) {
  }
}`;

  async function _doRequest<Res>(request: GraphQLRequest): Promise<Res> {
    const response = await fetch(base, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(request),
      method: "POST",
      mode: "cors"
    });

    const result = await response.json();

    if (response.status != 200 || result.errors) {
      // If the API returns a non 200 status code (e.g., 400), the result of the call is an array of errors
      // that are passed into the EvrythngAPIError to potentially be reported on further up the stack.
      throw new EvrythngAPIError(`failed to execute operation: ${request.operationName}`, result.errors);
    }

    return <Res>result;
  }

  async function createAction(request: CreateActionRequest): Promise<CreateActionResponse> {
    return await _doRequest<CreateActionResponse>({
      operationName: OPERATIONS.CREATE_ACTION,
      mutation: CREATE_ACTION_MUTATION(request.action)
    });
  }

  return {
    createAction
  };
}
