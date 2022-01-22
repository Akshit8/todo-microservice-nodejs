import { Express } from "express";
import { Server } from "http";

class HTTPServer {
  private server: Server;
  private port: number;

  constructor(server: Server, port: number) {
    this.server = server;
    this.port = port;
  }

  registerServerEventHandlers() {
    this.server.on("error", (err: Error): void => {
      throw err;
    });

    this.server.on("close", () => {
      console.log("server process exit");
    });

    process.on("SIGTERM", () => {
      console.log("shutting http server gracefully");
      this.server.close();
    });

    process.on("SIGINT", () => {
      console.log("interupt signal recieved shutting down");
      this.server.close();
    });
  }

  static createServer(app: Express, port: number) {
    const httpServer = new HTTPServer(
      app.listen(port, () => {
        console.log("server started at ", port);
      }),
      port
    );

    httpServer.registerServerEventHandlers();
  }
}

export default HTTPServer;
