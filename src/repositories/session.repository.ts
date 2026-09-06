import { Session } from "@/models";
import { BaseRepository } from "./base.repository";


import { ISession } from "@/types/session.types";

class SessionRepository extends BaseRepository<ISession> {
  constructor() {
    super(Session);
  }

  async revokeSession(refreshToken: string) {
    return this.model.findOneAndUpdate(
      {
        refreshToken,
        isRevoked: false,
      },
      {
        isRevoked: true,
      },
      {
        new: true,
      }
    );
  }

  async revokeAllUserSessions(userId: string) {
    return this.model.updateMany(
      {
        user: userId,
        isRevoked: false,
      },
      {
        isRevoked: true,
      }
    );
  }

  async findValidSession(refreshToken: string) {
    return this.model.findOne({
      refreshToken,
      isRevoked: false,
      expiresAt: {
        $gt: new Date(),
      },
    });
  }
  async find(filter = {}) {
    return this.model.find(filter);
  }
  async updateMany(filter: object, update: object) {
    return this.model.updateMany(
      filter,
      update
    );
  }
}

export default new SessionRepository();