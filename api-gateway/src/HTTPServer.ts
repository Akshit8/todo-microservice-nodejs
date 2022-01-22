import { Express } from "express";
import { createServer, Server } from "http";

class HTTPServer {
  private server: Server;
  private host: string = "0.0.0.0";
  private port: number;

  constructor(app: Express, port: number) {
    this.port = port;

    this.server = createServer(app);
  }

  startCallBack = (): void => {
    console.log(`server listening at ${this.host}:${this.port}`);
  };

  start() {
    this.server.listen(this.port, this.startCallBack);

    this.registerServerEventHandlers();
  }

  stop() {
    this.server.close();
  }

  registerServerEventHandlers() {
    this.server.on("error", (err: Error): void => {
      console.error(err);
      this.stop();
    });

    this.server.on("close", () => {
      console.log("server process exit");
    });

    process.on("SIGTERM", () => {
      console.log("shutting http server gracefully...");
      this.stop();
    });

    process.on("SIGINT", () => {
      console.log("interupt signal recieved shutting down...");
      this.stop();
    });
  }
}

export default HTTPServer;
