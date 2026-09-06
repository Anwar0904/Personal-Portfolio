import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { ISeo } from "./seo.types";

export interface IPortfolio {
  title: string;

  slug: string;

  clientName: string;

  shortDescription: string;

  category: Types.ObjectId;


  content: string;

  featuredImage?: Types.ObjectId | null;

  gallery: Types.ObjectId[];

  services: Types.ObjectId[];

  industries: Types.ObjectId[];

  technologies: string[];

  projectUrl?: string;

  githubUrl?: string;

  completionDate?: Date | null;

  seo: ISeo;

  featured: boolean;

  status: ContentStatus;

  sortOrder: number;

  author: Types.ObjectId;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export interface PortfolioMethods { }

export interface PortfolioStatics {
  findBySlug(slug: string): Promise<PortfolioDocument | null>;

  findPublished(): Promise<PortfolioDocument[]>;

  findFeatured(): Promise<PortfolioDocument[]>;
}

export type PortfolioDocument =
  HydratedDocument<IPortfolio, PortfolioMethods>;

export type PortfolioModel =
  Model<IPortfolio, {}, PortfolioMethods> &
  PortfolioStatics;