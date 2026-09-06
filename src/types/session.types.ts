import { HydratedDocument, Model, Types } from "mongoose";

export interface ISession {
  user: Types.ObjectId;

  refreshToken: string;

  userAgent?: string;

  ipAddress?: string;

  expiresAt: Date;

  lastUsedAt: Date;

  isRevoked: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface SessionMethods {
  revoke(): Promise<void>;
}

export interface SessionStatics {
  findActiveByUser(
    userId: Types.ObjectId
  ): Promise<SessionDocument[]>;

  revokeAll(
    userId: Types.ObjectId
  ): Promise<void>;
}

export type SessionDocument =
  HydratedDocument<ISession, SessionMethods>;

export type SessionModel =
  Model<ISession, {}, SessionMethods> &
  SessionStatics;