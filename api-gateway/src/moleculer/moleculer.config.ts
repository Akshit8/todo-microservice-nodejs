import { BrokerOptions } from "moleculer";

export const brokerConfig: BrokerOptions = {
  // very imp configuration
  // if different then nodes can't connect
  namespace: "todo-app",
  nodeID: "gateway-node",
  transporter: {
    type: "NATS",
    options: {
      url: "nats://localhost:4222"
    }
  }
};
