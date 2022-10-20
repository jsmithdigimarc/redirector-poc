import { Request, Response } from "express";
import type { RedirectService } from "../services";
import { RedirectNotFoundError } from "../graphql";

export interface RedirectHandler {
  handleCreate(req: Request, res: Response): void;
  handleRedirect(req: Request, res: Response): void;
}

export function RedirectHandler(service: RedirectService): RedirectHandler {
  function handleCreate(req: Request, res: Response): void {
    const customerId = <string | undefined>req.headers["X-Customer-Id"];

    if (!customerId) {
      res.status(401).end();
      return;
    }

    service
      .create(customerId, req.body)
      .then((shortCode: string) => {
        res.status(201).send(shortCode);
      })
      .catch((err: any) => {
        console.log(err);
        res.status(500).send("internal server error");
      });
  }

  function handleRedirect(req: Request, res: Response): void {
    service
      .evaluateRedirects(req.params.shortCode)
      .then((redirectUrl: string) => {
        res.redirect(307, redirectUrl);
      })
      .catch((err: any) => {
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
