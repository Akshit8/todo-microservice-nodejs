import { BrokerOptions } from "moleculer";

const brokerConfig: BrokerOptions = {
  namespace: "auth",
  nodeID: "auth-node",
  transporter: {
    type: "NATS",
    options: {
      url: "nats://localhost:4222"
    }
  }
};

export default brokerConfig;
