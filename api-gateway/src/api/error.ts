export class APIError extends Error {
  success: boolean;

  status_code: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.success = false;
    this.status_code = statusCode;
  }
}

export class InternalServerError extends APIError {
  constructor() {
    super(500, "internal server error");
  }
}

export class NotFoundError extends APIError {
  constructor() {
    super(404, "requested resource not found");
  }
}
