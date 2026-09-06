import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { UserStatus } from "@/enums";
import { IImage } from "./image.types";
import { RoleDocument } from "./role.types";

export interface IUser {

  firstName: string;

  lastName?: string;

  email: string;

  password: string;

  avatar?: IImage | string | null;

  role: Types.ObjectId | RoleDocument;

  status: UserStatus;

  passwordResetToken?: string | null;

  passwordResetExpires?: Date | null;

  /**
   * Legacy verification field.
   */
  emailVerified?: boolean;

  isEmailVerified?: boolean;

  emailVerificationToken?: string | null;

  emailVerificationExpires?: Date | null;

  lastLogin?: Date | null;

  passwordChangedAt?: Date | null;

  phone?: string | null;

  jobTitle?: string | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface UserMethods {
  comparePassword(
    candidatePassword: string
  ): Promise<boolean>;
}

export interface UserStatics {
  findByEmail(
    email: string
  ): Promise<UserDocument | null>;
}

export type UserDocument =
  HydratedDocument<IUser, UserMethods>;

export type UserModel =
  Model<IUser, object, UserMethods> &
  UserStatics;