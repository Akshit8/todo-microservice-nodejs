import { ConnectionOptions } from "typeorm";

export default {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "todo-service",
  entities: ["src/entity/*.ts", "src/entity/*.js"],
  migrations: ["db/migrations/*.ts", "db/migrations/*.js"],
  cli: {
    migrationsDir: "db/migrations"
  },
  synchronize: false
} as ConnectionOptions;
