import "@/models/media.model";
import "@/models/user.model";
import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IService,
  ServiceModel,
} from "@/types/service.types";

import {
  CONTENT_STATUS,
} from "@/enums";

import { FAQSchema } from "@/schemas/faq.schema";
import { FeatureSchema } from "@/schemas/feature.schema";
import { ImageSchema } from "@/schemas/image.schema";

import { generateSlug } from "@/utils/slugify";
import { SeoSchema } from "@/schemas/seo.schema";


const ServiceSchema =
  new Schema<IService, ServiceModel>(
    {
      title: {
        type: String,
        required: [true, "Service title is required"],
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

      features: {
        type: [FeatureSchema],
        default: [],
      },

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
      collection: "services",
      toJSON: {
        virtuals: true,
      },
      toObject: {
        virtuals: true,
      },
    }
  );


ServiceSchema.pre("validate", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = generateSlug(this.title);
  }
});


ServiceSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

ServiceSchema.index({
  status: 1,
});

ServiceSchema.index({
  featured: 1,
});

ServiceSchema.index({
  sortOrder: 1,
});

ServiceSchema.index({
  author: 1,
});

ServiceSchema.index({
  title: "text",
  shortDescription: "text",
  content: "text",
});

ServiceSchema.pre("validate", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

ServiceSchema.static(
  "findBySlug",
  function (slug: string) {
    return this.findOne({
      slug,
      isDeleted: false,
    });
  }
);

ServiceSchema.static(
  "findPublished",
  function () {
    return this.find({
      status: CONTENT_STATUS.PUBLISHED,
      isDeleted: false,
    });
  }
);

ServiceSchema.static(
  "findFeatured",
  function () {
    return this.find({
      featured: true,
      status: CONTENT_STATUS.PUBLISHED,
      isDeleted: false,
    });
  }
);

export const Service =
  (models.Service as ServiceModel) ||
  model<IService, ServiceModel>(
    "Service",
    ServiceSchema
  );