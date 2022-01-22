import { ServiceBroker } from "moleculer";
import { brokerConfig } from "./moleculer.config";

export let broker: ServiceBroker;

export const createGatewayMoleculerService = (): ServiceBroker => {
  broker = new ServiceBroker(brokerConfig);
  broker.createService({
    name: "gateway-service"
  });

  return broker;
};

export const getServiceBroker = (): ServiceBroker => {
  return broker;
};
