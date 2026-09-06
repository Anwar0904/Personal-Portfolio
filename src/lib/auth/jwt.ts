import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "@/config/env";

import { JwtPayload } from "@/types/auth";

export class JwtService {
  private static getSecret(type: "access" | "refresh") {
    const secret = type === "access"
      ? env.JWT_ACCESS_SECRET
      : env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error(`JWT ${type} secret is not configured.`);
    }

    return secret as Secret;
  }

  static signAccessToken(
    payload: JwtPayload
  ) {
    return jwt.sign(
      payload,
      this.getSecret("access"),
      {
        expiresIn: env.JWT_ACCESS_EXPIRES,
      } as SignOptions
    );
  }

  static signRefreshToken(
    payload: JwtPayload
  ) {
    return jwt.sign(
      payload,
      this.getSecret("refresh"),
      {
        expiresIn: env.JWT_REFRESH_EXPIRES,
      } as SignOptions
    );
  }

  static verifyAccessToken(
    token: string
  ) {
    return jwt.verify(
      token,
      this.getSecret("access")
    ) as JwtPayload;
  }

  static verifyRefreshToken(
    token: string
  ) {
    return jwt.verify(
      token,
      this.getSecret("refresh")
    ) as JwtPayload;
  }

  static getExpiryDate(expiresIn: string): Date {
    const now = Date.now();

    const value = parseInt(expiresIn);

    if (expiresIn.endsWith("m")) {
      return new Date(now + value * 60 * 1000);
    }

    if (expiresIn.endsWith("h")) {
      return new Date(now + value * 60 * 60 * 1000);
    }

    if (expiresIn.endsWith("d")) {
      return new Date(now + value * 24 * 60 * 60 * 1000);
    }

    throw new Error(`Invalid expiresIn value: ${expiresIn}`);
  }
}