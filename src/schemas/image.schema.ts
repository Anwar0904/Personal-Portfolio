import { Schema } from "mongoose";
import { IImage } from "@/types/image.types";

export const ImageSchema =
  new Schema<IImage>(
    {
      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        required: true,
        trim: true,
      },

      alt: {
        type: String,
        default: "",
        trim: true,
      },

      width: {
        type: Number,
        default: null,
      },

      height: {
        type: Number,
        default: null,
      },

      mimeType: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: false,
      versionKey: false,
    }
  );