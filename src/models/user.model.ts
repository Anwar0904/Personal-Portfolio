import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IUser,
  UserModel,
} from "@/types/user.types";

import { USER_STATUS } from "@/enums";

import { ImageSchema } from "@/schemas/image.schema";

const UserSchema = new Schema<IUser, UserModel>(
  {

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 255,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    avatar: {
      type: ImageSchema,
      default: null,
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"],
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },

    /*
     * Password reset
     */
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    /*
     * Legacy email verification
     */
    emailVerified: {
      type: Boolean,
      default: false,
    },

    /*
     * Current email verification field
     */
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    /*
     * Login information
     */
    lastLogin: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    /*
     * Contact / employment
     */
    phone: {
      type: String,
      default: null,
      trim: true,
      maxlength: 30,
    },

    jobTitle: {
      type: String,
      default: null,
      trim: true,
      maxlength: 120,
    },

    /*
     * Audit fields
     */
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

    /*
     * Soft delete
     */
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
    timestamps: true,

    versionKey: false,

    collection: "users",

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

/*
 * Indexes
 *
 * Do not add index: true to the same fields
 * unnecessarily, otherwise Mongoose can produce
 * duplicate-index warnings.
 */
UserSchema.index(
  { email: 1 },
  { unique: true }
);

UserSchema.index({
  role: 1,
});

UserSchema.index({
  status: 1,
});

UserSchema.index({
  isDeleted: 1,
});

UserSchema.index({
  createdAt: -1,
});

/*
 * Hide sensitive fields from API responses.
 */
const sanitizeUser = (
  _doc: unknown,
  ret: any
) => {
  delete ret.password;
  delete ret.passwordResetToken;
  delete ret.passwordResetExpires;
  delete ret.emailVerificationToken;
  delete ret.emailVerificationExpires;
  delete ret.__v;

  return ret;
};

UserSchema.set("toJSON", {
  virtuals: true,
  transform: sanitizeUser,
});

UserSchema.set("toObject", {
  virtuals: true,
  transform: sanitizeUser,
});



/*
 * Prevent model recompilation during Next.js
 * development / hot reload.
 */
export const User =
  (models.User as UserModel) ||
  model<IUser, UserModel>(
    "User",
    UserSchema
  );

export default User;