import { ConnectionOptions } from "typeorm";

const DB_OPTIONS: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "auth-service",
  entities: ["src/entity/*.ts"],
  migrations: ["db/migrations/*.ts"],
  cli: {
    migrationsDir: "db/migrations"
  },
  synchronize: false
};

export default DB_OPTIONS;
