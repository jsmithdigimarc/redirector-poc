import type { Handler } from "express";
import type { RedirectionsService } from "../services";

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
          res.status(307).end(redirect);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("internal server error");
        });
    };
  }

  return {
    handleRedirect,
  };
}
