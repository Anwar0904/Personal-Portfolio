import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { IImage } from "./image.types";
import { ISeo } from "./seo.types";

export interface ICategory {
  name: string;

  slug: string;

  description?: string;

  image?: IImage | null;

  parent?: Types.ObjectId | null;

  seo?: ISeo | null;

  status: ContentStatus;

  sortOrder: number;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export interface CategoryMethods { }

export interface CategoryStatics {
  findBySlug(slug: string): Promise<CategoryDocument | null>;

  findPublished(): Promise<CategoryDocument[]>;

  findRootCategories(): Promise<CategoryDocument[]>;
}

export type CategoryDocument =
  HydratedDocument<ICategory, CategoryMethods>;

export type CategoryModel =
  Model<ICategory, {}, CategoryMethods> &
  CategoryStatics;