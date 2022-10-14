import type { App } from "./types";

export function routes(app: App) {
  app.router.post("/", app.redirectHandler.handleCreate);
  app.router.get("/:shortCode", app.redirectHandler.handleRedirect);
}
