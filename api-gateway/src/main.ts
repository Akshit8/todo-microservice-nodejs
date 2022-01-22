import { createExpressApp } from "./api";
import HTTPServer from "./HTTPServer";

// const gatewayBroker = new ServiceBroker(brokerConfig);

// const createGatewayService = async (): Promise<void> => {
//   gatewayBroker.createService({
//     name: "gateway-service"
//   });

//   await gatewayBroker.start();
// };

// createGatewayService();

(async () => {
  try {
    const app = createExpressApp();
    HTTPServer.createServer(app, 3000);
    HTTPServer.createServer(app, 3001);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
