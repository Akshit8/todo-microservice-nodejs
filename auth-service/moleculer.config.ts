import { BrokerOptions } from "moleculer";

const brokerConfig: BrokerOptions = {
  namespace: "todo-app",
  nodeID: "auth-node",
  transporter: {
    type: "NATS",
    options: {
      url: "nats://localhost:4222"
    }
  }
};

export default brokerConfig;
