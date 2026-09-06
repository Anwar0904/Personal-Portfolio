import "@/models/media.model";
import "@/models/service.model";
import "@/models/industry.model";
import "@/models/portfolio.model";
import "@/models/user.model";

import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  ITestimonial,
  TestimonialModel,
} from "@/types/testimonial.types";

import {
  CONTENT_STATUS,
} from "@/enums";

const TestimonialSchema =
  new Schema<ITestimonial, TestimonialModel>(
    {
      clientName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },


      company: {
        type: String,
        default: "",
        trim: true,
      },

      designation: {
        type: String,
        default: "",
        trim: true,
      },

      avatar: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        default: null,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },

      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        default: null,
      },

      portfolio: {
        type: Schema.Types.ObjectId,
        ref: "Portfolio",
        default: null,
      },

      industry: {
        type: Schema.Types.ObjectId,
        ref: "Industry",
        default: null,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: Object.values(CONTENT_STATUS),
        default: CONTENT_STATUS.PUBLISHED,
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
      collection: "testimonials",
      toJSON: {
        virtuals: true,
      },
      toObject: {
        virtuals: true,
      },
    }
  );

TestimonialSchema.index({ featured: 1 });

TestimonialSchema.index({ status: 1 });

TestimonialSchema.index({ rating: -1 });

TestimonialSchema.index({ service: 1 });

TestimonialSchema.index({ portfolio: 1 });

TestimonialSchema.index({ industry: 1 });

TestimonialSchema.index({ author: 1 });

TestimonialSchema.index({
  clientName: "text",
  company: "text",
  message: "text",
});

TestimonialSchema.static("findPublished", function () {
  return this.find({
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

TestimonialSchema.static("findFeatured", function () {
  return this.find({
    featured: true,
    status: CONTENT_STATUS.PUBLISHED,
    isDeleted: false,
  });
});

export const Testimonial =
  (models.Testimonial as TestimonialModel) ||
  model<ITestimonial, TestimonialModel>(
    "Testimonial",
    TestimonialSchema
  );