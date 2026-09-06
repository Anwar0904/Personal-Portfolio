import {
    HydratedDocument,
    Model,
    Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { ISeo } from "./seo.types";

export type TeamMemberEmploymentStatus =
    "active" | "inactive";

export interface ISocialLinks {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    website?: string;
}

export interface ISkill {
    name: string;
    level: number;
}

export interface ITeamMember {
    name: string;

    slug: string;

    designation: string;

    shortBio?: string;

    biography?: string;

    email?: string;

    phone?: string;

    avatar?: Types.ObjectId | null;

    gallery: Types.ObjectId[];

    skills: ISkill[];

    experience: number;

    socialLinks: ISocialLinks;

    seo: ISeo;

    featured: boolean;

    status: ContentStatus;

    employmentStatus:
    TeamMemberEmploymentStatus;

    sortOrder: number;

    author: Types.ObjectId;

    createdBy?: Types.ObjectId | null;

    updatedBy?: Types.ObjectId | null;

    isDeleted: boolean;

    deletedAt?: Date | null;
}

export interface TeamMemberMethods { }

export interface TeamMemberStatics {
    findBySlug(
        slug: string
    ): Promise<TeamMemberDocument | null>;

    findPublished(): Promise<
        TeamMemberDocument[]
    >;

    findFeatured(): Promise<
        TeamMemberDocument[]
    >;
}

export type TeamMemberDocument =
    HydratedDocument<
        ITeamMember,
        TeamMemberMethods
    >;

export type TeamMemberModel =
    Model<
        ITeamMember,
        {},
        TeamMemberMethods
    > &
    TeamMemberStatics;