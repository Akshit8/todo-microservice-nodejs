/* eslint-disable no-unused-vars */
import { Errors } from "moleculer";

enum ErrorTypes {
  DB_ERROR = "DATABASE_ERROR",
  APP_ERROR = "APPLICATION_ERROR",
  SERVICE_ERROR = "SERVICE_ERROR"
}

export class UserNotFoundError extends Errors.MoleculerError {
  constructor(data?: string) {
    super("user not found", 404, ErrorTypes.DB_ERROR, data);
  }
}

export class JWTError extends Errors.MoleculerError {
  constructor(msg?: string, data?: string) {
    super(msg || "JWT error", 1, ErrorTypes.APP_ERROR, data);
  }
}
