import { App } from "./app";
import { loadConfigFromProcessEnv } from "./config";

(() => {
  console.log("RULES ENGINE SERVICE");

  const config = loadConfigFromProcessEnv();
  console.log({ config });

  const app = App(config);
  app.router.listen(config.port, () => {
    console.log(`Server listening for connections on port ${config.port}`);
  });
})();
