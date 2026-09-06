import { Schema, model, models } from "mongoose";

import { IRole, RoleModel } from "@/types/role.types";
import { USER_STATUS } from "@/enums";
import { PermissionValues } from "@/constants/permissions";

const RoleSchema = new Schema<IRole, RoleModel>(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    permissions: {
      type: [String],
      enum: PermissionValues,
      default: [],
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "roles",

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

RoleSchema.index(
  { name: 1 },
  { unique: true }
);

RoleSchema.methods.hasPermission = function (
  permission: string
) {
  return this.permissions.includes(permission);
};

RoleSchema.statics.findByName = function (
  name: string
) {
  return this.findOne({
    name: name.trim().toLowerCase(),
  });
};

export const Role =
  (models.Role as RoleModel) ||
  model<IRole, RoleModel>(
    "Role",
    RoleSchema
  );