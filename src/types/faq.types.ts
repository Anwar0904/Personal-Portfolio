import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";

export interface IFAQ {
  question: string;

  answer: string;
}

export interface IFAQManagement extends IFAQ {
  status: ContentStatus;

  sortOrder: number;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export type FAQDocument = HydratedDocument<
  IFAQManagement
>;

export type FAQModel = Model<IFAQManagement>;
