# Redirector POC

# Diagram

![diagram](./docs/Rules%20Engine.png)

# Services

## Redirections

- Responsible for allowing a user to create redirects. And for returning the appropriate redirect (as a 307) when a user makes a request with a particular short code.

## Actions

- Empty stub in the POC but would be responsible for persisting an action in a tenant database and publishing the action to a topic for other services to react to.

## Rules

- Responsible for allowing a user to create rules. Long term there may be multiple types of rules, each with their own associated metadata. For the POC the only type is a 'redirector' rule and the metadata for the rule contains a redirectUrl to send the user to if the rule passes.
- Also, responsible for parsing and evaluating rules against a dynamic payload. This service exposes an endpoint that allows a collection of rules and a dynamic object to be supplied. The match property on each rule in the collection is parsed into a data structure that can be consumed by json-rules-engine. The payload and parsed rules are then evaluated by json-rules-engine and any rules that passed evaluation are returned to the caller.
  - This pattern gives us a flexible rules engine and pushes the logic of what to do with rules back to the calling service. For example, the Redirections service will call the evaluate endpoint and expect to get back zero to many rules. The service will then select the rule with the highest weight and redirect the user to the redirectUrl of that rule (or the defaultRedirectUrl of the original redirect if no rules were found, or no rules pass).

## GraphQL

- A postgraphile service that allows a caller to connect to a tenant database to query information from that database via GraphQL. One service may connect to multiple databases in a single cloud sql instance.
