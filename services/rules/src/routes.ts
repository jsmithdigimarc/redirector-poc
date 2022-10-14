import type { App } from "./types";

export function routes(app: App) {
  // create
  app.router.post("/", app.rulesHandler.handleCreate);
  // update
  app.router.patch("/:id", app.rulesHandler.handleUpdate);
  // delete
  app.router.delete("/:id", app.rulesHandler.handleDelete);
  // evaluate
  app.router.post("/evaluate", app.rulesHandler.handleEvaluate);
}
