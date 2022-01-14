import { sign, verify } from "jsonwebtoken";

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
            reject(err);
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
          reject(err);
          return;
        }
        resolve(payload);
      });
    });
  }
}
