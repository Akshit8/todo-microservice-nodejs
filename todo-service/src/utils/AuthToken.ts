import { NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken";
import { AuthenticationError, AuthTokenError } from "../errors";

export interface tokenPayload {
  id: number;
}

export interface AuthToken {
  verifyToken(token: string): Promise<tokenPayload>;
}

export class JWT implements AuthToken {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async verifyToken(token: string): Promise<tokenPayload> {
    return new Promise<tokenPayload>((resolve, reject) => {
      verify(token, this.secret, (err: any, payload: any) => {
        if (err) {
          let e;
          if (err instanceof TokenExpiredError || err instanceof NotBeforeError) {
            e = new AuthenticationError();
          } else if (err instanceof Error) {
            e = new AuthTokenError(err.message);
          } else {
            e = new AuthTokenError("unknown error occured while verifying token");
          }
          reject(e);
          return;
        }
        resolve(payload);
      });
    });
  }
}
