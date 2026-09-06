import { Schema } from "mongoose";

import { ISeo } from "@/types/seo.types";
import { ImageSchema } from "./image.schema";

export const SeoSchema = new Schema<ISeo>(
  {
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },

    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },

    canonicalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    ogTitle: {
      type: String,
      default: "",
      trim: true,
    },

    ogDescription: {
      type: String,
      default: "",
      trim: true,
    },

    ogImage: {
      type: ImageSchema,
      default: null,
    },

    robots: {
      type: String,
      default: "index,follow",
    },

    schemaMarkup: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);