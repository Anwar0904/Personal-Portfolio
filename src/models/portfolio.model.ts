import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IPortfolio,
  PortfolioModel,
} from "@/types/portfolio.types";

import {
  CONTENT_STATUS,
} from "@/enums";

import { SeoSchema } from "@/schemas/seo.schema";
import { generateSlug } from "@/utils/slugify";

const PortfolioSchema =
  new Schema<IPortfolio, PortfolioModel>(
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

      clientName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
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
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
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

      industries: [
        {
          type: Schema.Types.ObjectId,
          ref: "Industry",
        },
      ],

      technologies: {
        type: [String],
        default: [],
      },

      projectUrl: {
        type: String,
        default: "",
        trim: true,
      },

      githubUrl: {
        type: String,
        default: "",
        trim: true,
      },

      completionDate: {
        type: Date,
        default: null,
      },

      seo: {
        type: SeoSchema,
        required: true,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: Object.values(CONTENT_STATUS),
        default: CONTENT_STATUS.DRAFT,
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
      collection: "portfolio",
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

PortfolioSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);
PortfolioSchema.index({ category: 1 });
PortfolioSchema.index({ featured: 1 });
PortfolioSchema.index({ status: 1 });
PortfolioSchema.index({ services: 1 });
PortfolioSchema.index({ industries: 1 });
PortfolioSchema.index({ author: 1 });

PortfolioSchema.index({
  title: "text",
  clientName: "text",
  shortDescription: "text",
  content: "text",
});

PortfolioSchema.pre("validate", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

PortfolioSchema.static("findBySlug", function (slug: string) {
  return this.findOne({
    slug,
    isDeleted: false,
  });
});

PortfolioSchema.static("findPublished", function () {
  return this.find({
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

PortfolioSchema.static("findFeatured", function () {
  return this.find({
    featured: true,
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

export const Portfolio =
  (models.Portfolio as PortfolioModel) ||
  model<IPortfolio, PortfolioModel>(
    "Portfolio",
    PortfolioSchema
  );