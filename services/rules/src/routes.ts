import type { App } from "./types";

export function routes(app: App) {
  app.router.post("/", app.rulesHandler.handleEvaluate());
}
