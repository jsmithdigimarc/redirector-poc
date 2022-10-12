import type { Product, Redirection, Rule, Thng } from "../types";
import { GoogleAuth } from "google-auth-library";

export interface EvrythngClient {
  getRedirection(
    request: GetRedirectionRequest
  ): Promise<GetRedirectionResponse>;

  getRedirectMeta(
    request: GetRedirectMetaRequest
  ): Promise<GetRedirectMetaResponse>;
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

export type GetRedirectMetaRequest = {
  accountId: string;
  evrythngId: string;
};

export type GetRedirectMetaResponse = {
  rules: Rule[] | null;
  thng: Thng | null;
  product: Product | null;
};

export type GetRedirectionRequest = {
  shortCode: string;
};

export type GetRedirectionResponse = {
  redirection: Redirection | null;
};

export class EvrythngAPIError extends Error {
  errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);

    this.errors = errors;
  }
}

export function EvrythngClient(base: string): EvrythngClient {
  const auth = new GoogleAuth();

  const OPERATIONS = {
    GET_REDIRECTION: "getRedirection",
    GET_REDIRECT_META: "getRedirectMeta"
  };

  const GET_REDIRECTION_QUERY = (
    shortId: string
  ) => `query ${OPERATIONS.GET_REDIRECTION} {
  redirection(shortId: "${shortId}") {
    productId
    thngId
    defaultRedirectUrl
    shortDomain
    shortId
  }
}`;

  const GET_REDIRECT_META_QUERY = (
    accountId: string,
    evrythngId: string
  ) => `query ${OPERATIONS.GET_REDIRECT_META} {
  thng(id: "${evrythngId}") {
    id
    name
    location
    customFields
    description
    customFields
    tags
    properties
  }
  product(id: "${evrythngId}") {
    id
    name
    brand
    customFields
    tags
    description
    properties
  }
}`;

  async function _doRequest<Res>(request: GraphQLRequest): Promise<GraphQLResponse<Res>> {
    const client = await auth.getIdTokenClient(base);
    const response = await client.request<GraphQLResponse<Res>>({
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: request,
      method: "POST"
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

  async function getRedirection(
    request: GetRedirectionRequest
  ): Promise<GetRedirectionResponse> {
    const result = await _doRequest<GetRedirectionResponse>({
      operationName: OPERATIONS.GET_REDIRECTION,
      query: GET_REDIRECTION_QUERY(request.shortCode)
    });

    return result.data;
  }

  async function getRedirectMeta(
    request: GetRedirectMetaRequest
  ): Promise<GetRedirectMetaResponse> {
    const result = await _doRequest<GetRedirectMetaResponse>({
      operationName: OPERATIONS.GET_REDIRECT_META,
      query: GET_REDIRECT_META_QUERY(request.accountId, request.evrythngId)
    });

    return result.data;
  }

  return {
    getRedirection,
    getRedirectMeta
  };
}
