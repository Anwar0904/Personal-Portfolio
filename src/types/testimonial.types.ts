import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";

export interface ITestimonial {
  clientName: string;

  company?: string;

  designation?: string;

  avatar?: Types.ObjectId | null;

  message: string;

  rating: number;

  service?: Types.ObjectId | null;

  portfolio?: Types.ObjectId | null;

  industry?: Types.ObjectId | null;

  featured: boolean;

  status: ContentStatus;

  sortOrder: number;

  author: Types.ObjectId;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export interface TestimonialMethods {}

export interface TestimonialStatics {
  findPublished(): Promise<TestimonialDocument[]>;

  findFeatured(): Promise<TestimonialDocument[]>;
}

export type TestimonialDocument =
  HydratedDocument<
    ITestimonial,
    TestimonialMethods
  >;

export type TestimonialModel =
  Model<
    ITestimonial,
    {},
    TestimonialMethods
  > &
  TestimonialStatics;