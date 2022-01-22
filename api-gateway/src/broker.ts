import { ServiceBroker } from "moleculer";
import { brokerConfig } from "./moleculer.config";

export const broker = new ServiceBroker(brokerConfig);

export const setupGatewayMoleculerService = async (): Promise<void> => {
  broker.createService({
    name: "gateway"
  });

  await broker.start();
};
