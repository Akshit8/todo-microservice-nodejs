import { BrokerOptions } from "moleculer";

export default {
  namespace: "todo-app",
  nodeID: "auth-node",
  transporter: {
    type: "NATS",
    options: {
      url: "nats://localhost:4222"
    }
  },
  validator: true,
  logger: {
    type: "Console"
  }
} as BrokerOptions;
