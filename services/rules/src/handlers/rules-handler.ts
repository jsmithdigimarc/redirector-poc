import type { Request, Response } from "express";
import type { Rule } from "../types";
import type { EvaluationService, RulesService } from "../services";

export interface RulesHandler {
  handleCreate(req: Request, res: Response): void;
  handleUpdate(req: Request, res: Response): void;
  handleDelete(req: Request, res: Response): void;
  handleEvaluate(req: Request, res: Response): void;
}

export function RulesHandler(
  rulesService: RulesService,
  evaluationService: EvaluationService
): RulesHandler {
  function handleCreate(req: Request, res: Response) {
    const { rule }: { rule: Rule } = req.body;
    rulesService
      .createRule(rule)
      .then((id) => {
        res.status(201).send(id);
      })
      .catch((err) => {
        console.log(err);
        // TODO: This is a bad pattern because an error might be a validation
        // error which should be handled as a 400
        res.status(500).send("internal server error");
      });
  }

  function handleUpdate(req: Request, res: Response): void {
    const { rule }: { rule: Rule } = req.body;
    rulesService
      .updateRule(rule)
      .then((id) => {
        res.status(200).send(id);
      })
      .catch((err) => {
        console.log(err);
        // TODO: This is a bad pattern because an error might be a validation
        // error which should be handled as a 400
        res.status(500).send("internal server error");
      });
  }

  function handleDelete(req: Request, res: Response): void {
    const { id } = req.params;

    rulesService
      .deleteRule(id)
      .then((id) => {
        res.status(200).send(id);
      })
      .catch((err) => {
        console.log(err);
        // TODO: This is a bad pattern because an error might be a validation
        // error which should be handled as a 400
        res.status(500).send("internal server error");
      });
  }

  function handleEvaluate(req: Request, res: Response) {
    const { rules, payload }: { rules: Rule[]; payload: Object } = req.body;
    evaluationService
      .evaluate(rules, payload)
      .then((matches) => {
        res.status(200).json(matches);
      })
      .catch((err) => {
        console.log(err);
        // TODO: This is a bad pattern because an error might be a validation
        // error which should be handled as a 400
        res.status(500).send("internal server error");
      });
  }

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEvaluate,
  };
}
