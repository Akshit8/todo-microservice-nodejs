import { createExpressApp } from "./api";
import HTTPServer from "./HTTPServer";

(async () => {
  try {
    // await setupGatewayMoleculerService();

    const app = createExpressApp();
    const httpServer = new HTTPServer(app, 3000);

    httpServer.start();
  } catch (err) {
    // to handle broker relates errors only.
    console.error(err);
    process.exit(1);
  }
})();
