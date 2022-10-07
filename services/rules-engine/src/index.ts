import * as http from "http";
import { App } from "./app";

(() => {
  const port = process.env.PORT || 8080;

  const app = App();
  const httpServer = http.createServer(app.router);

  httpServer.listen(port, () => {
    console.log(`Server listening for connections on port ${port}`);
  });
})();
