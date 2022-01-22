import { createExpressApp } from "./api";
import { createGatewayMoleculerService } from "./broker";
import HTTPServer from "./HTTPServer";

(async () => {
  try {
    const gatewayBroker = createGatewayMoleculerService();
    await gatewayBroker.start();

    const app = createExpressApp();
    const httpServer = new HTTPServer(app, 3000);

    httpServer.start();
  } catch (err) {
    // to handle broker relates errors only.
    console.error(err);
    process.exit(1);
  }
})();
