import { ServiceBroker } from "moleculer";
import { createExpressApp } from "./api";
import HTTPServer from "./HTTPServer";
import { brokerConfig } from "./moleculer.config";

const gatewayBroker = new ServiceBroker(brokerConfig);

const createGatewayService = async (): Promise<void> => {
  gatewayBroker.createService({
    name: "gateway-service"
  });

  await gatewayBroker.start();
};

createGatewayService();

(async () => {
  try {
    const app = createExpressApp();
    const httpServer = new HTTPServer(app, 3000);
    httpServer.start();
  } catch (e) {}
})();
