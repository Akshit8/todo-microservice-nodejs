export interface tokenPayload {}

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
    return "";
  }

  async verifyToken(token: string): Promise<tokenPayload> {
    return {};
  }
}
