import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import {
  ContentStatus,
} from "@/enums";

import { IImage } from "./image.types";
import { ISeo } from "./seo.types";
import { IFAQ } from "./faq.types";
import { IFeature } from "./feature.types";

export interface IService {
  title: string;

  slug: string;

  shortDescription: string;

  content: string;

  icon?: IImage | null;

  featuredImage?: Types.ObjectId | null;

  gallery: Types.ObjectId[];

  features: IFeature[];

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

export interface ServiceMethods { }

export interface ServiceStatics {
  findBySlug(
    slug: string
  ): Promise<ServiceDocument | null>;

  findPublished(): Promise<ServiceDocument[]>;

  findFeatured(): Promise<ServiceDocument[]>;
}

export type ServiceDocument =
  HydratedDocument<IService, ServiceMethods>;

export type ServiceModel =
  Model<IService, {}, ServiceMethods> &
  ServiceStatics;