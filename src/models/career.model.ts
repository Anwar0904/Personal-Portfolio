import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  ICareer,
  CareerModel,
} from "@/types/career.types";

import {
  CONTENT_STATUS,
} from "@/enums";

import { SeoSchema } from "@/schemas/seo.schema";
import { generateSlug } from "@/utils/slugify";

const CareerSchema = new Schema<ICareer, CareerModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    employmentType: {
      type: String,
      required: true,
    },

    workplace: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    expiresAt: {
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
    collection: "careers",
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

CareerSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

CareerSchema.index({
  status: 1,
});

CareerSchema.index({
  featured: 1,
});

CareerSchema.index({
  department: 1,
});

CareerSchema.index({
  employmentType: 1,
});

CareerSchema.index({
  workplace: 1,
});

CareerSchema.index({
  expiresAt: 1,
});

CareerSchema.index({
  createdAt: -1,
});

CareerSchema.index({
  title: "text",
  description: "text",
  department: "text",
  skills: "text",
});

CareerSchema.pre("validate", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

CareerSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;

  return this.expiresAt < new Date();
});

CareerSchema.static("findPublished", function () {
  return this.find({
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

CareerSchema.static("findOpenJobs", function () {
  return this.find({
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } },
    ],
  });
});

CareerSchema.static("findBySlug", function (slug: string) {
  return this.findOne({
    slug,
    isDeleted: false,
  });
});
export const Career =
  (models.Career as CareerModel) ||
  model<ICareer, CareerModel>(
    "Career",
    CareerSchema
  );