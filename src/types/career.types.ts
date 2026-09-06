import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import {
  ContentStatus,
  EmploymentType,
  Workplace,
} from "@/enums";

import { ISeo } from "./seo.types";

export interface ICareer {
  title: string;

  slug: string;

  department: string;

  employmentType: EmploymentType;

  workplace: Workplace;

  location: string;

  openings: number;

  experience: string;

  salary?: string;

  description: string;

  responsibilities: string[];

  requirements: string[];

  benefits: string[];

  skills: string[];

  expiresAt?: Date | null;

  seo: ISeo;

  featured: boolean;

  status: ContentStatus;

  sortOrder: number;

  author: Types.ObjectId;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface CareerMethods {}

export interface CareerStatics {
  findPublished(): Promise<CareerDocument[]>;

  findOpenJobs(): Promise<CareerDocument[]>;

  findBySlug(
    slug: string
  ): Promise<CareerDocument | null>;
}

export type CareerDocument =
  HydratedDocument<ICareer, CareerMethods>;

export type CareerModel =
  Model<ICareer, {}, CareerMethods> &
  CareerStatics;