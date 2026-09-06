import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { ISeo } from "./seo.types";
import { IFAQ } from "./faq.types";
import { IImage } from "./image.types";

export interface IIndustry {
  title: string;

  slug: string;

  shortDescription: string;

  content: string;

  icon?: IImage | null;

  featuredImage?: Types.ObjectId | null;

  gallery: Types.ObjectId[];

  services: Types.ObjectId[];

  faqs: IFAQ[];

  seo: ISeo;

  status: ContentStatus;

  featured: boolean;

  sortOrder: number;

  author: Types.ObjectId;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export interface IndustryMethods {}

export interface IndustryStatics {
  findBySlug(slug: string): Promise<IndustryDocument | null>;

  findPublished(): Promise<IndustryDocument[]>;

  findFeatured(): Promise<IndustryDocument[]>;
}

export type IndustryDocument =
  HydratedDocument<IIndustry, IndustryMethods>;

export type IndustryModel =
  Model<IIndustry, {}, IndustryMethods> &
  IndustryStatics;