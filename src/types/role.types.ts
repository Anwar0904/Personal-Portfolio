import {
  HydratedDocument,
  Model,
} from "mongoose";

import { USER_STATUS } from "@/enums";

export interface IRole {
  name: string;

  description?: string;

  permissions: string[];

  isDefault: boolean;

  status: (typeof USER_STATUS)[keyof typeof USER_STATUS];

  createdAt?: Date;

  updatedAt?: Date;
}

export interface RoleMethods {
  hasPermission(
    permission: string
  ): boolean;
}

export interface RoleStatics {
  findByName(
    name: string
  ): Promise<RoleDocument | null>;
}

export type RoleDocument =
  HydratedDocument<
    IRole,
    RoleMethods
  >;

export type RoleModel =
  Model<
    IRole,
    object,
    RoleMethods
  > &
  RoleStatics;