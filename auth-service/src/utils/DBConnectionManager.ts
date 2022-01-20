import { LoggerInstance } from "moleculer";
import { Connection, createConnection } from "typeorm";

export class DBConnectionManager {
  private connection: Connection | undefined = undefined;
  private logger: Omit<LoggerInstance, "fatal">;

  constructor(logger?: LoggerInstance) {
    this.logger = logger || console;
  }

  async connect(): Promise<Connection> {
    this.connection = await createConnection();
    if (await this.connection.showMigrations()) {
      this.logger.info("running pending migrations");
      await this.connection.runMigrations();
    }

    return this.connection;
  }

  async close(): Promise<void> {
    if (this.connection && this.connection.isConnected) {
      await this.connection.close();
    }
  }
}
