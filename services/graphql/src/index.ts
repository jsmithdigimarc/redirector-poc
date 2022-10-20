import express from "express";
import { loadConfigFromProcessEnv } from "./config";
import { HandlerFactory } from "./handler-factory";

const app = express();

const config = loadConfigFromProcessEnv();
const handlerFactory = HandlerFactory(config);

app.use("/redirects", (req, res, next) =>
  handlerFactory.createRedirectHandler()(req, res, next)
);

app.use("/consumerengagement/:customerId", (req, res, next) => {
  const customerId = req.params["customerId"];
  const handler = handlerFactory.createConsumerEngagementHandler(customerId);
  handler(req, res, next);
});

app.listen(8080);
