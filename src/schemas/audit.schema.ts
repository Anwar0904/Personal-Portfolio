import { Schema } from "mongoose";
import { IAudit } from "@/types/audit.types";

export const AuditSchema = new Schema<IAudit>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);