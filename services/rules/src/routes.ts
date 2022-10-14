import type { App } from "./types";

export function routes(app: App) {
  // create
  app.router.post("/", app.rulesHandler.handleCreate);

  // update
  app.router.patch("/:id", (_, res) => {
    res.status(501).send("not implemented");
  });

  // delete
  app.router.delete("/:id", (_, res) => {
    res.status(501).send("not implemented");
  });

  // evaluate
  app.router.post("/evaluate", app.rulesHandler.handleEvaluate);
}
