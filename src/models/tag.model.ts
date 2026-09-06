import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  ITag,
  TagModel,
} from "@/types/tag.types";

import {
  CONTENT_STATUS,
} from "@/enums";

import { generateSlug } from "@/utils/slugify";

const TagSchema =
  new Schema<ITag, TagModel>(
    {
      name: {
        type: String,
        required: [true, "Tag name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50,
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
        maxlength: 500,
      },

      color: {
        type: String,
        default: "#3B82F6",
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          "Invalid hex color",
        ],
      },

      status: {
        type: String,
        enum: Object.values(CONTENT_STATUS),
        default: CONTENT_STATUS.DRAFT,
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

      collection: "tags",

      toJSON: {
        virtuals: true,
      },

      toObject: {
        virtuals: true,
      },
    }
  );

TagSchema.index(
  {
    slug: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

TagSchema.index({
  status: 1,
});

TagSchema.index({
  name: "text",
  description: "text",
});

TagSchema.pre("validate", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = generateSlug(this.name);
  }
});

TagSchema.static(
  "findBySlug",
  function (slug: string) {
    return this.findOne({
      slug,
      isDeleted: false,
    });
  }
);

TagSchema.static(
  "findPublished",
  function () {
    return this.find({
      status: CONTENT_STATUS.PUBLISHED,
      isDeleted: false,
    });
  }
);

export const Tag =
  (models.Tag as TagModel) ||
  model<ITag, TagModel>(
    "Tag",
    TagSchema
  );