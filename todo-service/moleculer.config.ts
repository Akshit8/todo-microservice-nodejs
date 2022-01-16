import { BrokerOptions } from "moleculer";

const brokerConfig: BrokerOptions = {
  namespace: "todo-app",
  nodeID: "todo-node",
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
};

export default brokerConfig;
