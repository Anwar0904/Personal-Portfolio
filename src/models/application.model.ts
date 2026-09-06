import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IApplication,
  ApplicationModel,
} from "@/types/application.types";

import {
  APPLICATION_STATUS,
} from "@/enums";

import {
  BudgetSchema,
} from "@/schemas/budget.schema";

import {
  NoteSchema,
} from "@/schemas/note.schema";

const ApplicationSchema =
new Schema<IApplication, ApplicationModel>(
{
  career:{
    type:Schema.Types.ObjectId,
    ref:"Career",
    required:true,
  },

  fullName:{
    type:String,
    required:true,
    trim:true,
    maxlength:100,
  },

  email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
  },

  phone:{
    type:String,
    required:true,
    trim:true,
  },

  address:{
    type:String,
    default:"",
    trim:true,
  },

  resume:{
    type:Schema.Types.ObjectId,
    ref:"Media",
    required:true,
  },

  coverLetter:{
    type:String,
    default:"",
  },

  portfolioUrl:{
    type:String,
    default:"",
    trim:true,
  },

  linkedinUrl:{
    type:String,
    default:"",
    trim:true,
  },

  githubUrl:{
    type:String,
    default:"",
    trim:true,
  },

  experience:{
    type:Number,
    default:0,
    min:0,
  },

  expectedSalary:{
    type:BudgetSchema,
    default:null,
  },

  skills:{
    type:[String],
    default:[],
  },

  status:{
    type:String,
    enum:Object.values(APPLICATION_STATUS),
    default:APPLICATION_STATUS.APPLIED,
  },

  notes:{
    type:[NoteSchema],
    default:[],
  },

  reviewedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    default:null,
  },

  reviewedAt:{
    type:Date,
    default:null,
  },

  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    default:null,
  },

  updatedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    default:null,
  },

  isDeleted:{
    type:Boolean,
    default:false,
  },

  deletedAt:{
    type:Date,
    default:null,
  },
},
{
  timestamps:true,
  versionKey:false,
  collection:"applications",
  toJSON:{virtuals:true},
  toObject:{virtuals:true},
}
);

ApplicationSchema.index({ career: 1 });

ApplicationSchema.index({ email: 1 });

ApplicationSchema.index({ status: 1 });

ApplicationSchema.index({ reviewedBy: 1 });

ApplicationSchema.index({ createdAt: -1 });

ApplicationSchema.index({
  fullName: "text",
  email: "text",
  skills: "text",
});

ApplicationSchema.pre("save", function () {
  if (
    this.status !== APPLICATION_STATUS.APPLIED &&
    !this.reviewedAt
  ) {
    this.reviewedAt = new Date();
  }
});

ApplicationSchema.static("findPending", function () {
  return this.find({
    status: APPLICATION_STATUS.APPLIED,
    isDeleted: false,
  });
});

ApplicationSchema.static("findByCareer", function (career) {
  return this.find({
    career,
    isDeleted: false,
  });
});

ApplicationSchema.static("findByEmail", function (email: string) {
  return this.find({
    email: email.toLowerCase(),
    isDeleted: false,
  });
});

export const Application =
  (models.Application as ApplicationModel) ||
  model<IApplication, ApplicationModel>(
    "Application",
    ApplicationSchema
  );