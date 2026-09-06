import bcrypt from "bcryptjs";

import { env } from "@/config/env";

export class PasswordService {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(
      password,
      env.BCRYPT_SALT_ROUNDS
    );
  }


  static async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(
      password,
      hashedPassword
    );
  }
}