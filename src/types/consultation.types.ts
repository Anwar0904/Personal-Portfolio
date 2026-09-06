import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import {
  ConsultationType,
  MeetingType,
} from "@/enums";

import { INote } from "./note.types";

export interface IConsultation {
  lead: Types.ObjectId;

  assignedTo?: Types.ObjectId | null;

  scheduledAt: Date;

  duration: number;

  meetingType: MeetingType;

  meetingLink?: string;

  location?: string;

  agenda?: string;

  notes: INote[];

  status: ConsultationType;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface ConsultationMethods {
  isUpcoming: boolean;
}

export interface ConsultationStatics {
  upcoming(): Promise<ConsultationDocument[]>;
  completed(): Promise<ConsultationDocument[]>;
  byLead(
    lead: Types.ObjectId
  ): Promise<ConsultationDocument[]>;
}

export type ConsultationDocument =
  HydratedDocument<
    IConsultation,
    ConsultationMethods
  >;

export type ConsultationModel =
  Model<
    IConsultation,
    object,
    ConsultationMethods
  > &
  ConsultationStatics;