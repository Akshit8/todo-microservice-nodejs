/* eslint-disable no-unused-vars */
export enum ServiceErrorTypes {
  BAD_REQUEST_ERROR = "BAD_REQUEST_ERROR",
  RESOURCE_NOT_FOUND_ERROR = "RESOURCE_NOT_FOUND_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  SERVICE_ERROR = "SERVICE_ERROR"
}

export enum ServiceErrorCode {
  BAD_REQUEST_ERROR = "ES01",
  RESOURCE_NOT_FOUND_ERROR = "ES02",
  VALIDATION_ERROR = "ES03",
  AUTHENTICATION_ERROR = "ES04",
  AUTHORIZATION_ERROR = "ES05",
  SERVICE_ERROR = "ES06"
}

export class BaseServiceError extends Error {
  constructor(
    public http_status_code: number,
    public internal_status_code: ServiceErrorCode,
    public type: ServiceErrorTypes,
    message: string
  ) {
    super(message);
    this.name = type;
  }
}

export class InternalServiceError extends BaseServiceError {
  constructor(message?: string) {
    super(
      500,
      ServiceErrorCode.SERVICE_ERROR,
      ServiceErrorTypes.SERVICE_ERROR,
      message || "internal service error"
    );
  }
}

export class BadRequestError extends BaseServiceError {
  constructor(message?: string) {
    super(
      400,
      ServiceErrorCode.BAD_REQUEST_ERROR,
      ServiceErrorTypes.BAD_REQUEST_ERROR,
      message || "bad request error"
    );
  }
}

export class AuthenticationError extends BaseServiceError {
  constructor(message?: string) {
    super(
      401,
      ServiceErrorCode.AUTHENTICATION_ERROR,
      ServiceErrorTypes.AUTHENTICATION_ERROR,
      message || "unable to authenticate user"
    );
  }
}

export class ResourceNotFoundError extends BaseServiceError {
  constructor(message?: string) {
    super(
      404,
      ServiceErrorCode.RESOURCE_NOT_FOUND_ERROR,
      ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR,
      message || "requested resource not found"
    );
  }
}

export class ValidationError extends BaseServiceError {
  constructor(message?: string) {
    super(
      422,
      ServiceErrorCode.SERVICE_ERROR,
      ServiceErrorTypes.VALIDATION_ERROR,
      message || "invalid data recieved"
    );
  }
}
