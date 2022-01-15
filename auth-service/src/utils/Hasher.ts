import { compare, hash } from "bcryptjs";
import { PasswordHashingError } from "../errors";

export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  checkPassword(password: string, hash: string): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher {
  private saltRounds = 8;

  async hashPassword(password: string): Promise<string> {
    let pswd: string = "";
    try {
      pswd = await hash(password, this.saltRounds);
    } catch (err) {
      // wrap custom error
      if (err instanceof Error) {
        throw new PasswordHashingError(err.message);
      }
      throw new PasswordHashingError("error while hashing password");
    }
    return pswd;
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    let check: boolean = false;
    try {
      check = await compare(password, hash);
    } catch (err) {
      // wrap custom error
      if (err instanceof Error) {
        throw new PasswordHashingError(err.message);
      }
      throw new PasswordHashingError("error while comparing passwords");
    }
    return check;
  }
}
