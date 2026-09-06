import {
    Schema,
    model,
    models,
} from "mongoose";

import {
    CONTENT_STATUS,
} from "@/enums";

import {
    ITeamMember,
    TeamMemberModel,
} from "@/types/team-member.types";

import { SeoSchema } from "@/schemas/seo.schema";

import { generateSlug } from "@/utils/slugify";

import "@/models/media.model";
import "@/models/user.model";

const SkillSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        level: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
);

const SocialLinksSchema = new Schema(
    {
        facebook: String,
        linkedin: String,
        twitter: String,
        instagram: String,
        github: String,
        website: String,
    },
    {
        _id: false,
        versionKey: false,
    }
);

const TeamMemberSchema = new Schema<
    ITeamMember,
    TeamMemberModel
>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        slug: {
            type: String,
            trim: true,
            lowercase: true,
        },

        designation: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        shortBio: {
            type: String,
            default: "",
            maxlength: 500,
        },

        biography: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            default: "",
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        avatar: {
            type: Schema.Types.ObjectId,
            ref: "Media",
            default: null,
        },

        gallery: [
            {
                type: Schema.Types.ObjectId,
                ref: "Media",
            },
        ],

        skills: {
            type: [SkillSchema],
            default: [],
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        socialLinks: {
            type: SocialLinksSchema,
            default: () => ({}),
        },

        seo: {
            type: SeoSchema,
            required: true,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        /*
         * Content / publishing status
         */
        status: {
            type: String,
            enum: Object.values(
                CONTENT_STATUS
            ),
            default:
                CONTENT_STATUS.DRAFT,
        },

        /*
         * Employment status
         */
        employmentStatus: {
            type: String,
            enum: [
                "active",
                "inactive",
            ],
            default: "active",
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

        collection: "team_members",

        toJSON: {
            virtuals: true,
        },

        toObject: {
            virtuals: true,
        },
    }
);

TeamMemberSchema.index(
    {
        slug: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

TeamMemberSchema.index({
    status: 1,
});

TeamMemberSchema.index({
    employmentStatus: 1,
});

TeamMemberSchema.index({
    featured: 1,
});

TeamMemberSchema.index({
    designation: 1,
});

TeamMemberSchema.index({
    author: 1,
});

TeamMemberSchema.index({
    name: "text",
    designation: "text",
    shortBio: "text",
    biography: "text",
});

TeamMemberSchema.pre(
    "validate",
    function () {
        const doc =
            this as unknown as ITeamMember & {
                isModified(
                    path: string
                ): boolean;
            };

        if (
            doc.isModified("name") ||
            !doc.slug
        ) {
            doc.slug = generateSlug(
                doc.name
            );
        }

        if (!doc.employmentStatus) {
            doc.employmentStatus =
                "active";
        }
    }
);

TeamMemberSchema.static(
    "findBySlug",
    function (slug: string) {
        return this.findOne({
            slug,
            isDeleted: false,
        });
    }
);

TeamMemberSchema.static(
    "findPublished",
    function () {
        return this.find({
            status:
                CONTENT_STATUS.PUBLISHED,
            isDeleted: false,
        });
    }
);

TeamMemberSchema.static(
    "findFeatured",
    function () {
        return this.find({
            featured: true,
            status:
                CONTENT_STATUS.PUBLISHED,
            isDeleted: false,
        });
    }
);

export const TeamMember =
    (models.TeamMember as TeamMemberModel) ||
    model<
        ITeamMember,
        TeamMemberModel
    >(
        "TeamMember",
        TeamMemberSchema
    );