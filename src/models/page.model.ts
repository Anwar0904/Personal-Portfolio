import {
    Schema,
    model,
    models,
} from "mongoose";

import {
    IPage,
    PageModel,
} from "@/types/page.types";

import {
    CONTENT_STATUS,
} from "@/enums";

import { SeoSchema } from "@/schemas/seo.schema";

import { generateSlug } from "@/utils/slugify";

const PageSchema =
    new Schema<IPage, PageModel>(

        {

            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 200,
            },

            slug: {
                type: String,
                lowercase: true,
                trim: true,
            },

            excerpt: {
                type: String,
                default: "",
                maxlength: 500,
            },

            content: {
                type: String,
                default: "",
            },

            featuredImage: {
                type: Schema.Types.ObjectId,
                ref: "Media",
                default: null,
            },

            seo: {
                type: SeoSchema,
                required: true,
            },

            status: {
                type: String,
                enum: Object.values(CONTENT_STATUS),
                default: CONTENT_STATUS.DRAFT,
            },

            isHomePage: {
                type: Boolean,
                default: false,
            },

            template: {
                type: String,
                default: "default",
            },

            author: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            publishedAt: {
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
            }

        },

        {

            timestamps: true,

            versionKey: false,

            collection: "pages",

            toJSON: { virtuals: true },

            toObject: { virtuals: true }

        }

    );

PageSchema.index(
    {
        slug: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false
        }
    }
);

PageSchema.index({
    status: 1
});

PageSchema.index({
    author: 1
});

PageSchema.index({
    publishedAt: -1
});

PageSchema.index({
    title: "text",
    excerpt: "text",
    content: "text"
});

PageSchema.pre("validate", function () {

    if (this.isModified("title") || !this.slug) {

        this.slug = generateSlug(this.title);

    }

});

PageSchema.static(
    "findBySlug",

    function (slug: string) {

        return this.findOne({
            slug,
            isDeleted: false,
        });

    }

);

PageSchema.static(
    "findPublished",

    function () {

        return this.find({

            status: CONTENT_STATUS.PUBLISHED,

            isDeleted: false,

        });

    }

);

PageSchema.static(
    "getHomePage",

    function () {

        return this.findOne({

            isHomePage: true,

            status: CONTENT_STATUS.PUBLISHED,

            isDeleted: false,

        });

    }

);

export const Page =
    (models.Page as PageModel) ||

    model<IPage, PageModel>(

        "Page",

        PageSchema

    );