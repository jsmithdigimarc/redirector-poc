import type { Handler } from "express";
import type { RedirectionsService } from "../services";
import { RedirectNotFoundError } from "../services/redirections-service";

export interface RedirectionsHandler {
  handleRedirect(): Handler;
}

export function RedirectionsHandler(
  service: RedirectionsService
): RedirectionsHandler {
  function handleRedirect(): Handler {
    return function handler(req, res) {
      const shortCode = <string>req.query["shortCode"];

      service
        .getRedirect(shortCode)
        .then((redirect) => {
          res.redirect(307, redirect);
        })
        .catch((err) => {
          console.log(err);
          if (err instanceof RedirectNotFoundError) {
            res.status(404).send("not found");
            return;
          }
          res.status(500).send("internal server error");
        });
    };
  }

  return {
    handleRedirect
  };
}
