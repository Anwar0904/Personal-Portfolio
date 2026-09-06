import { Types } from "mongoose";

export interface INote {
  note: string;
  createdBy?: Types.ObjectId | null;
  createdAt: Date;
}