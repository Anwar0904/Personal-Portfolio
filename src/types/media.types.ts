// src/types/media.types.ts

import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

export type MediaType =
  | "image"
  | "video"
  | "document";

export interface IMedia {
  name: string;

  originalName: string;

  publicId?: string;

  url: string;

  type: MediaType;

  mimeType: string;

  size: number;

  alt?: string;

  folder?: string;

  uploadedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type MediaDocument =
  HydratedDocument<IMedia>;

export type MediaModel =
  Model<IMedia>;
