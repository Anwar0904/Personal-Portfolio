import {
  Schema,
  model,
  models,
  Document,
} from "mongoose";

import {
  ICategory,
  CategoryModel,
} from "@/types/category.types";

import {
  CONTENT_STATUS,
} from "@/enums";

import { ImageSchema } from "@/schemas/image.schema";
import { SeoSchema } from "@/schemas/seo.schema";

import { generateSlug } from "@/utils/slugify";

const CategorySchema =
  new Schema<ICategory, CategoryModel>(
    {
      name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      slug: {
        type: String,
        trim: true,
        lowercase: true,
      },

      description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 1000,
      },

      image: {
        type: ImageSchema,
        default: null,
      },

      parent: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null,
      },

      seo: {
        type: SeoSchema,
        default: null,
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

      collection: "categories",

      toJSON: {
        virtuals: true,
      },

      toObject: {
        virtuals: true,
      },
    }
  );


CategorySchema.index(
  { slug: 1 },
  { unique: true }
);

CategorySchema.index({
  parent: 1,
});

CategorySchema.index({
  status: 1,
});

CategorySchema.index({
  name: "text",
  description: "text",
});

CategorySchema.pre("validate", function () {
  if (
    this.isModified("name") ||
    !this.slug
  ) {
    this.slug = generateSlug(this.name);
  }
});

CategorySchema.static(
  "findBySlug",
  function (slug: string) {
    return this.findOne({
      slug,
      isDeleted: false,
    });
  }
);

CategorySchema.static(
  "findPublished",
  function () {
    return this.find({
      status: CONTENT_STATUS.PUBLISHED,
      isDeleted: false,
    });
  }
);

CategorySchema.static(
  "findRootCategories",
  function () {
    return this.find({
      parent: null,
      isDeleted: false,
    });
  }
);


export const Category =
  (models.Category as CategoryModel) ||
  model<ICategory, CategoryModel>(
    "Category",
    CategorySchema
  );