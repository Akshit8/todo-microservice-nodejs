import { JsonWebTokenError, sign, TokenExpiredError, verify } from "jsonwebtoken";
import { JWTError } from "../errors";

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

  constructor(secret: string, duration: string) {
    this.secret = secret;
    this.duration = duration;
  }

  async signToken(payload: tokenPayload): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        payload,
        this.secret,
        { expiresIn: this.duration },
        (err: Error | null, token: string | undefined): void => {
          if (err) {
            const e = new JWTError("error signing token", err.message);
            reject(e);
            return;
          }
          if (!token) {
            reject(new Error("token not returned"));
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
          if (err instanceof TokenExpiredError) {
            e = new JWTError("token expired error", err.message);
          } else if (err instanceof JsonWebTokenError) {
            e = new JWTError("jwt library internal error", err.message);
          } else {
            e = new JWTError("unknown error occured on token verification");
          }
          reject(e);
          return;
        }
        resolve(payload);
      });
    });
  }
}
