import { Schema } from "mongoose";

import { Currency } from "@/enums";
import { IBudget } from "@/types/budget.types";

export const BudgetSchema = new Schema<IBudget>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.USD,
      required: true,
    },
  },
  {
    _id: false,
  }
);