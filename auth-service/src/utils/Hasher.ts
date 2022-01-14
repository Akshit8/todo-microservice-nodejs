import { compare, hash } from "bcryptjs";

export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  checkPassword(password: string, hash: string): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher {
  private saltRounds = 8;

  async hashPassword(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
