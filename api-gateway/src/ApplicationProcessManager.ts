import { Express } from "express";
import { LoggerInstance, ServiceBroker } from "moleculer";
import { createServer, Server } from "http";

interface HTTPServerConfig {
  host: string;
  port: number;
}

class ApplicationProcessManager {
  private server: Server;
  private httpServerConfig: HTTPServerConfig;
  public broker: ServiceBroker;
  public logger: LoggerInstance;

  constructor(app: Express, broker: ServiceBroker) {
    this.httpServerConfig = {
      host: "0.0.0.0",
      port: 3000
    };
    this.server = createServer(app);

    this.broker = broker;
    this.logger = this.broker.logger;
  }

  start() {
    this.registerEventsHandler();

    this.broker.start();

    this.server.listen(this.httpServerConfig.port, this.httpServerConfig.host);
  }

  stop() {
    this.broker.stop();

    this.server.close();
  }

  registerEventsHandler() {
    this.server.on("listening", (): void => {
      this.logger.info(
        `HTTP server listening at ${this.httpServerConfig.host}:${this.httpServerConfig.port}`
      );
    });

    this.server.on("error", (err: Error): void => {
      this.logger.error(err);
      this.stop();
    });

    this.server.on("close", () => {
      this.logger.info("HTTP server process exited");
    });

    process.on("SIGTERM", () => {
      this.logger.info("shutting application gracefully...");
      this.stop();
    });

    process.on("SIGINT", () => {
      this.logger.info("interupt signal recieved shutting down application...");
      this.stop();
    });
  }
}

export default ApplicationProcessManager;
