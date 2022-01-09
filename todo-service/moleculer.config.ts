import { BrokerOptions } from "moleculer";

const brokerConfig: BrokerOptions = {
  namespace: "todo",
  nodeID: "todo-node",
  transporter: {
    type: "NATS",
    options: {
      url: "nats://localhost:4222"
    }
  }
};

export default brokerConfig;
