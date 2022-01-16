import { BrokerOptions, Errors } from "moleculer";
import { ValidationError } from "./src/errors";

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
} as BrokerOptions;
