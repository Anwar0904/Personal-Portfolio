import { Types } from "mongoose";

export interface IAudit {
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}