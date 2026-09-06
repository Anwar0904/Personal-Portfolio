import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { ISeo } from "./seo.types";
import { IFAQ } from "./faq.types";

export interface IBlog {
  title: string;

  slug: string;

  excerpt?: string;

  content: string;

  featuredImage?: Types.ObjectId | null;

  gallery?: Types.ObjectId[];

  category: Types.ObjectId;

  tags: Types.ObjectId[];

  author: Types.ObjectId;

  seo: ISeo;

  faqs?: IFAQ[];

  status: ContentStatus;

  featured: boolean;

  views: number;

  readingTime: number;

  publishedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface BlogMethods { }

export interface BlogStatics {
  findBySlug(slug: string): Promise<BlogDocument | null>;

  findPublished(): Promise<BlogDocument[]>;

  findFeatured(): Promise<BlogDocument[]>;
}

export type BlogDocument =
  HydratedDocument<IBlog, BlogMethods>;

export type BlogModel =
  Model<IBlog, {}, BlogMethods> &
  BlogStatics;
