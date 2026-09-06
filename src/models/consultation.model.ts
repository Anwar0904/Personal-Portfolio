import {
  model,
  models,
  Schema,
} from "mongoose";

import {
  IConsultation,
  ConsultationModel,
} from "@/types/consultation.types";

import {
  CONSULTATION_STATUS,
  MEETING_TYPE,
} from "@/enums";

import { NoteSchema } from "@/schemas/note.schema";

import "@/models/lead.model"
const ConsultationSchema =
  new Schema<IConsultation, ConsultationModel>(
    {
      lead: {
        type: Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
      },

      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      scheduledAt: {
        type: Date,
        required: true,
      },

      duration: {
        type: Number,
        default: 30,
        min: 15,
      },

      meetingType: {
        type: String,
        enum: Object.values(MEETING_TYPE),
        required: true,
      },

      meetingLink: {
        type: String,
        default: "",
        trim: true,
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      agenda: {
        type: String,
        default: "",
        trim: true,
      },

      notes: {
        type: [NoteSchema],
        default: [],
      },

      status: {
        type: String,
        enum: Object.values(CONSULTATION_STATUS),
        default: CONSULTATION_STATUS.SCHEDULED,
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

      collection: "consultations",

      toJSON: {
        virtuals: true,
      },

      toObject: {
        virtuals: true,
      },
    }
  );

ConsultationSchema.index({
  lead: 1,
});

ConsultationSchema.index({
  assignedTo: 1,
});

ConsultationSchema.index({
  scheduledAt: 1,
});

ConsultationSchema.index({
  status: 1,
});

ConsultationSchema.index({
  meetingType: 1,
});

ConsultationSchema.index({
  createdAt: -1,
});

ConsultationSchema.virtual("isUpcoming").get(function () {
  return (
    this.scheduledAt > new Date() &&
    this.status === CONSULTATION_STATUS.SCHEDULED
  );
});


ConsultationSchema.pre("save", function () {
  if (
    this.meetingType === MEETING_TYPE.ZOOM &&
    !this.meetingLink
  ) {
    throw new Error(
      "Meeting link is required for online consultations."
    );
  }

  if (
    this.meetingType === MEETING_TYPE.IN_PERSON &&
    !this.location
  ) {
    throw new Error(
      "Location is required for office consultations."
    );
  }
});

ConsultationSchema.static(
  "upcoming",
  function () {
    return this.find({
      scheduledAt: {
        $gte: new Date(),
      },
      status:
        CONSULTATION_STATUS.SCHEDULED,
      isDeleted: false,
    }).sort({
      scheduledAt: 1,
    });
  }
);

ConsultationSchema.static("completed", function () {
  return this.find({
    status: CONSULTATION_STATUS.COMPLETED,
    isDeleted: false,
  });
});

ConsultationSchema.static("byLead", function (lead) {
  return this.find({
    lead,
    isDeleted: false,
  });
});

export const Consultation =
  (models.Consultation as ConsultationModel) ||
  model<IConsultation, ConsultationModel>(
    "Consultation",
    ConsultationSchema
  );

ConsultationSchema.method(
  "isUpcoming",
  function () {
    return (
      !this.isDeleted &&
      this.scheduledAt > new Date() &&
      this.status ===
      CONSULTATION_STATUS.SCHEDULED
    );
  }
);