import type { App } from "./types";

export function routes(app: App) {
  app.router.get("/", app.redirectionsHandler.handleRedirect());
}
