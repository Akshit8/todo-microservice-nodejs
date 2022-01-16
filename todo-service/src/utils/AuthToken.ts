import { NotBeforeError, sign, TokenExpiredError, verify } from "jsonwebtoken";
import { AuthenticationError, AuthTokenError } from "../errors";

export interface tokenPayload {
  id: number;
}

export interface AuthToken {
  signToken(payload: tokenPayload): Promise<string>;
  verifyToken(token: string): Promise<tokenPayload>;
}

export class JWT implements AuthToken {
  private secret: string;
  private duration: string;

  constructor(secret: string, duration?: string) {
    this.secret = secret;
    this.duration = duration || "24h";
  }

  async signToken(payload: tokenPayload): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        payload,
        this.secret,
        { expiresIn: this.duration },
        (err: Error | null, token: string | undefined): void => {
          if (err) {
            reject(new AuthTokenError(err.message));
            return;
          }
          if (!token) {
            reject(new AuthTokenError("auth token undefined"));
            return;
          }
          resolve(token);
        }
      );
    });
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
