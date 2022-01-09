import { BrokerOptions } from "moleculer";

export const brokerConfig: BrokerOptions = {
  namespace: "gateway",
  nodeID: "gateway-node",
  transporter: {
    type: "NATS",
    options: {
      url: "nats://localhost:4222"
    }
  }
};
