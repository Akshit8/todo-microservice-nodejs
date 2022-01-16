/* eslint-disable no-unused-vars */
export enum InternalErrorTypes {
  ORM_ERROR = "ORM_ERROR",
  AUTH_TOKEN_ERROR = "TOKEN_ERROR"
}

export class BaseInternalError extends Error {
  constructor(public type: string, message: string) {
    super(message);
    this.name = type;
  }
}

export class ORMError extends BaseInternalError {
  constructor(message: string) {
    super(InternalErrorTypes.ORM_ERROR, message);
  }
}

export class AuthTokenError extends BaseInternalError {
  constructor(message: string) {
    super(InternalErrorTypes.AUTH_TOKEN_ERROR, message);
  }
}
