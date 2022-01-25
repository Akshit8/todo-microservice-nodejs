import { LoggerInstance } from "moleculer";
import { getServiceBroker } from "./moleculer/broker";

const logger = getServiceBroker().logger;

export const getAppLogger = (): LoggerInstance => {
  return logger;
};
