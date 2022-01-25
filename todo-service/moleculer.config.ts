import { BrokerOptions, Errors } from "moleculer";
import { ValidationError } from "./src/errors";

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
  },
  errorHandler: (err: Error, info: any) => {
    // TODO: handle efficiently
    if (err instanceof Errors.ValidationError) {
      const e = new ValidationError(err.data[0].message);

      return {
        success: false,
        http_status_code: e.http_status_code,
        error: {
          error_code: e.internal_status_code,
          error_type: e.type,
          error_message: e.message
        }
      };
    }

    throw err;
  }
};

export default brokerConfig;
