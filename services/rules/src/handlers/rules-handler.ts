import type { Handler } from "express";
import type { Rule } from "../types";
import type { RulesService } from "../services";

export interface RulesHandler {
  handleEvaluate(): Handler;
}

export function RulesHandler(service: RulesService): RulesHandler {
  function handleEvaluate(): Handler {
    return function handler(req, res) {
      const { rules, payload }: { rules: Rule[]; payload: Object } = req.body;

      service
        .evaluateRules(rules, payload)
        .then((matches) => {
          res.status(200).json(matches);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("internal server error");
        });
    };
  }

  return {
    handleEvaluate,
  };
}
