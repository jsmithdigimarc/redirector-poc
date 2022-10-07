import type { Handler } from "express";
import type { Action } from "../types";
import type { ActionsService } from "../services";

export interface ActionsHandler {
  handleCreate(): Handler;
}

export function ActionsHandler(service: ActionsService): ActionsHandler {
  function handleCreate(): Handler {
    return function handler(req, res) {
      const { action }: { action: Action } = req.body;

      service
        .create(action)
        .then((id) => {
          res.status(201).end(id);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("internal server error");
        });
    };
  }

  return {
    handleCreate,
  };
}
