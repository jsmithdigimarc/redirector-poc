const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

const pgConfig = {
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
};

const postgraphileOptions = {
  graphiql: true,
  enhanceGraphiql: true,
};

console.log("host ", pgConfig.host);
console.log("port ", pgConfig.port);
console.log("user ", pgConfig.user);
console.log("database ", pgConfig.database);

app.use(postgraphile(pgConfig, "public", postgraphileOptions));

app.listen(8080);
