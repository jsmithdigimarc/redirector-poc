import { Handler, request, Request, Response } from "express";
import type { RedirectService } from "../services";
import { RedirectNotFoundError } from "../services";

export interface RedirectHandler {
  handleCreate(req: Request, res: Response): void;
  handleRedirect(req: Request, res: Response): void;
}

export function RedirectHandler(service: RedirectService): RedirectHandler {
  function handleCreate(req: Request, res: Response): void {
    service
      .create(req.body)
      .then((shortCode) => {
        res.status(201).send(shortCode);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("internal server error");
      });
  }

  function handleRedirect(req: Request, res: Response): void {
    service
      .getRedirect(req.params.shortCode)
      .then((redirectUrl) => {
        res.status(307).send(redirectUrl);
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof RedirectNotFoundError) {
          res.status(404).send("not found");
        } else {
          res.status(500).send("internal server error");
        }
      });
  }

  return {
    handleCreate,
    handleRedirect,
  };
}
