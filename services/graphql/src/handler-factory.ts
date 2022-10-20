import postgraphile, {
  HttpRequestHandler,
  PostGraphileOptions,
} from "postgraphile";
import { Config } from "./types";

export interface HandlerFactory {
  createRedirectHandler(): HttpRequestHandler;
  createConsumerEngagementHandler(customerId: string): HttpRequestHandler;
}

const postgraphileOptions: PostGraphileOptions = {
  graphiql: true,
  enhanceGraphiql: true,
  watchPg: true,
  dynamicJson: true,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
};

export function HandlerFactory(config: Config): HandlerFactory {
  const HANDLER_CACHE = new Map<string, HttpRequestHandler>();
  let REDIRECT_HANDLER: HttpRequestHandler;

  return {
    createRedirectHandler() {
      if (!REDIRECT_HANDLER) {
        REDIRECT_HANDLER = postgraphile(
          {
            ...config,
            database: "redirect",
          },
          "public",
          postgraphileOptions
        );
      }

      return REDIRECT_HANDLER;
    },
    createConsumerEngagementHandler(customerId) {
      let handler = HANDLER_CACHE.get(customerId);
      if (!handler) {
        handler = postgraphile(
          {
            ...config,
            database: `consumerengagement_${customerId}`,
          },
          "public",
          postgraphileOptions
        );

        HANDLER_CACHE.set(customerId, handler);
      }

      return handler;
    },
  };
}
