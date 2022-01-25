import { ServiceBroker } from "moleculer";
import { brokerConfig } from "./moleculer.config";

const broker = new ServiceBroker(brokerConfig);

export const createMoleculerServiceBroker = (): ServiceBroker => {
  broker.createService({
    name: "gateway"
  });

  return broker;
};

export const getServiceBroker = (): ServiceBroker => {
  return broker;
};
