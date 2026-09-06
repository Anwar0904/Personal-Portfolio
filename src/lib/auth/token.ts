import crypto from "crypto";

import { JwtService } from "./jwt";

import { JwtPayload } from "@/types/auth";

export class TokenService {
  static generateTokens(
    payload: JwtPayload
  ) {
    const accessToken =
      JwtService.signAccessToken(payload);

    const refreshToken =
      JwtService.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  static hashRefreshToken(
    refreshToken: string
  ): string {
    return crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
  }
}