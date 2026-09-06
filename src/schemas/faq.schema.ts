import { Schema } from "mongoose";
import { IFAQ } from "@/types/faq.types";

export const FAQSchema =
  new Schema<IFAQ>(
    {
      question: {
        type: String,
        required: true,
        trim: true,
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