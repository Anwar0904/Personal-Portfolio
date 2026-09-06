import "@/models/media.model";
import "@/models/service.model";
import "@/models/user.model";
import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IIndustry,
  IndustryModel,
} from "@/types/industry.types";

import {
  CONTENT_STATUS,
} from "@/enums";

import { SeoSchema } from "@/schemas/seo.schema";
import { FAQSchema } from "@/schemas/faq.schema";
import { ImageSchema } from "@/schemas/image.schema";

import { generateSlug } from "@/utils/slugify";

const IndustrySchema =
  new Schema<IIndustry, IndustryModel>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 150,
      },

      slug: {
        type: String,
        trim: true,
        lowercase: true,
      },

      shortDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },

      content: {
        type: String,
        required: true,
      },

      icon: {
        type: ImageSchema,
        default: null,
      },

      featuredImage: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        default: null,
      },

      gallery: [
        {
          type: Schema.Types.ObjectId,
          ref: "Media",
        },
      ],

      services: [
        {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
      ],

      faqs: {
        type: [FAQSchema],
        default: [],
      },

      seo: {
        type: SeoSchema,
        required: true,
      },

      status: {
        type: String,
        enum: Object.values(CONTENT_STATUS),
        default: CONTENT_STATUS.DRAFT,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      sortOrder: {
        type: Number,
        default: 0,
        min: 0,
      },

      author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },

      deletedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
      versionKey: false,
      collection: "industries",
      toJSON: {
        virtuals: true,
      },
      toObject: {
        virtuals: true,
      },
    }
  );

IndustrySchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

IndustrySchema.index({ status: 1 });

IndustrySchema.index({ featured: 1 });

IndustrySchema.index({ sortOrder: 1 });

IndustrySchema.index({ author: 1 });

IndustrySchema.index({ services: 1 });

IndustrySchema.index({
  title: "text",
  shortDescription: "text",
  content: "text",
});

IndustrySchema.pre("validate", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

IndustrySchema.static("findBySlug", function (slug: string) {
  return this.findOne({
    slug,
    isDeleted: false,
  });
});

IndustrySchema.static("findPublished", function () {
  return this.find({
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

IndustrySchema.static("findFeatured", function () {
  return this.find({
    featured: true,
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

export const Industry =
  (models.Industry as IndustryModel) ||
  model<IIndustry, IndustryModel>(
    "Industry",
    IndustrySchema
  );