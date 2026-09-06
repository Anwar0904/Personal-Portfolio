// src/models/media.model.ts

import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IMedia,
  MediaModel,
} from "@/types/media.types";

const MediaSchema =
  new Schema<IMedia, MediaModel>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      originalName: {
        type: String,
        required: true,
        trim: true,
      },

      /*
       * Kept for compatibility with existing media collections. The sparse
       * unique index allows records that do not use an external provider,
       * while still protecting IDs when they are present.
       */
      publicId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "image",
          "video",
          "document",
        ],
        required: true,
      },

      mimeType: {
        type: String,
        required: true,
      },

      size: {
        type: Number,
        required: true,
      },

      alt: {
        type: String,
        default: "",
        trim: true,
      },

      folder: {
        type: String,
        default: "general",
        trim: true,
      },

      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      isDeleted: {
        type: Boolean,
        default: false,
        index: true,
      },

      deletedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
      versionKey: false,
      collection: "media",

      toJSON: {
        virtuals: true,
      },

      toObject: {
        virtuals: true,
      },
    }
  );

MediaSchema.index({
  createdAt: -1,
});

MediaSchema.index({
  type: 1,
});

MediaSchema.index({
  folder: 1,
});

export const Media =
  (models.Media as MediaModel) ||
  model<IMedia, MediaModel>(
    "Media",
    MediaSchema
  );
