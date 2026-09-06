import {
  Schema,
  model,
  models,
} from "mongoose";

import "@/models/service.model";
import "@/models/user.model";

import {
  ILead,
  LeadModel,
} from "../types/lead.types";

import {
  LEAD_SOURCE,
  LEAD_STATUS,
} from "@/enums";

import { BudgetSchema } from "@/schemas/budget.schema";
import { NoteSchema } from "@/schemas/note.schema";

const LeadSchema =
  new Schema<ILead, LeadModel>(
    {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      company: {
        type: String,
        default: "",
        trim: true,
        maxlength: 150,
      },

      website: {
        type: String,
        default: "",
        trim: true,
      },

      projectTitle: {
        type: String,
        trim: true,
        default: "",
      },

      projectType: {
        type: String,
        trim: true,
        default: "",
      },

      timeline: {
        type: String,
        trim: true,
        default: "",
      },

      preferredContact: {
        type: String,
        enum: [
          "email",
          "phone",
          "video-call",
        ],
        default: "email",
      },

      attachments: {
        type: [String],
        default: [],
      },

      interestedServices: [
        {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
      ],

      budget: {
        type: BudgetSchema,
        default: null,
      },

      message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: 5000,
      },

      source: {
        type: String,
        enum: Object.values(LEAD_SOURCE),
        default: LEAD_SOURCE.WEBSITE,
      },

      status: {
        type: String,
        enum: Object.values(LEAD_STATUS),
        default: LEAD_STATUS.NEW,
      },

      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      notes: {
        type: [NoteSchema],
        default: [],
      },

      contactedAt: {
        type: Date,
        default: null,
      },

      convertedAt: {
        type: Date,
        default: null,
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

      collection: "leads",

      toJSON: {
        virtuals: true,
      },

      toObject: {
        virtuals: true,
      },
    }
  );

LeadSchema.static("findByEmail", function (email: string) {
  return this.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });
});

export const Lead =
  (models.Lead as LeadModel) ||
  model<ILead, LeadModel>(
    "Lead",
    LeadSchema
  );
