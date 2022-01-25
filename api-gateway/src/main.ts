import { createExpressApp } from "./api";
import ApplicationProcessManager from "./ApplicationProcessManager";
import { createMoleculerServiceBroker } from "./moleculer/broker";

(() => {
  const expressApp = createExpressApp();
  const broker = createMoleculerServiceBroker();
  const application = new ApplicationProcessManager(expressApp, broker);
  application.start();
})();
