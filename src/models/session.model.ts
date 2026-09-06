import {
  Schema,
  model,
  models,
  Types,
} from "mongoose";

import {
  ISession,
  SessionModel,
} from "@/types/session.types";

const SessionSchema =
  new Schema<ISession, SessionModel>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      refreshToken: {
        type: String,
        required: true,
      },

      userAgent: {
        type: String,
        default: "",
        trim: true,
      },

      ipAddress: {
        type: String,
        default: "",
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      lastUsedAt: {
        type: Date,
        default: Date.now,
      },

      isRevoked: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
      versionKey: false,
      collection: "sessions",
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

SessionSchema.index({
  user: 1,
  isRevoked: 1,
});

SessionSchema.index({
  refreshToken: 1,
});

SessionSchema.index({
  createdAt: -1,
});

SessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

SessionSchema.static(
  "findActiveByUser",
  function (userId: Types.ObjectId) {
    return this.find({
      user: userId,
      isRevoked: false,
    });
  }
);

SessionSchema.static(
  "revokeAll",
  async function (userId: Types.ObjectId) {
    await this.updateMany(
      {
        user: userId,
      },
      {
        isRevoked: true,
      }
    );
  }
);

SessionSchema.method(
  "revoke",
  async function () {
    this.isRevoked = true;
    await this.save();
  }
);

export const Session =
  (models.Session as SessionModel) ||
  model<ISession, SessionModel>(
    "Session",
    SessionSchema
  );