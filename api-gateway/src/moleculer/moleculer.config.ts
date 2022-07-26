import { BrokerOptions } from "moleculer";

export const brokerConfig: BrokerOptions = {
  // very imp configuration
  // if different then nodes can't connect
  namespace: "todo-app",
  nodeID: "gateway-node",
  transporter: {
    type: "NATS",
    options: {
      url: process.env.TRANSPORTER_URL || "nats://localhost:4222"
    }
  },
  metrics: {
    enabled: process.env.ENABLE_METRICS === "true",
    reporter: [
      {
        type: "Prometheus",
        options: {
          port: 3030,
          path: "/metrics",
          defaultLabels: (registry: any) => {
            return {
              namespace: registry.broker.namespace,
              nodeID: registry.broker.nodeID
            };
          }
        }
      }
    ]
  }
};
