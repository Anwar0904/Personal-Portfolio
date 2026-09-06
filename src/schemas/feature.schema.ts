import { Schema } from "mongoose";

import { IFAQ } from "@/types/faq.types";
import { IFeature } from "@/types/feature.types";
import { ImageSchema } from "@/schemas/image.schema";

export const FeatureSchema =
  new Schema<IFeature>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      icon: {
        type: ImageSchema,
        default: null,
      },
    },
    {
      _id: false,
      versionKey: false,
    }
  );

export const FAQSchema =
  new Schema<IFAQ>(
    {
      question: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 300,
      },

      answer: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
      versionKey: false,
    }
  );
