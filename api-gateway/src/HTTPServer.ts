import { Express } from "express";
import { Server } from "http";

class HTTPServer {
  server: Server | Express;
  host: string;
  port: number;

  constructor(server: Server | Express, port: number) {
    this.server = server;
    this.host = "0.0.0.0";
    this.port = port;
  }

  async start(): Promise<void> {
    this.server.listen(this.port);
  }

  stop() {}
}

export default HTTPServer;
