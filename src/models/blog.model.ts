import {
    Schema,
    model,
    models,
} from "mongoose";

import {
    IBlog,
    BlogModel,
    BlogDocument,
} from "@/types/blog.types";

import {
    CONTENT_STATUS,
} from "@/enums";

import "@/models/media.model";
import "@/models/category.model";
import "@/models/tag.model";
import "@/models/user.model";

import { SeoSchema } from "@/schemas/seo.schema";
import { FAQSchema } from "@/schemas/faq.schema";

import { generateSlug } from "@/utils/slugify";

const BlogSchema =
    new Schema<IBlog, BlogModel>(
        {
            title: {
                type: String,
                required: [true, "Blog title is required"],
                trim: true,
                minlength: 5,
                maxlength: 200,
            },

            slug: {
                type: String,
                trim: true,
                lowercase: true,
            },

            excerpt: {
                type: String,
                default: "",
                maxlength: 500,
                trim: true,
            },

            content: {
                type: String,
                required: true,
            },

            featuredImage: {
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

            category: {
                type: Schema.Types.ObjectId,
                ref: "Category",
                required: true,
            },

            tags: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Tag",
                },
            ],

            author: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            seo: {
                type: SeoSchema,
                required: true,
            },

            faqs: {
                type: [FAQSchema],
                default: [],
            },

            status: {
                type: String,
                enum: Object.values(
                    CONTENT_STATUS
                ),
                default:
                    CONTENT_STATUS.DRAFT,
            },

            featured: {
                type: Boolean,
                default: false,
            },

            views: {
                type: Number,
                default: 0,
                min: 0,
            },

            readingTime: {
                type: Number,
                default: 1,
                min: 1,
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
            },
        },
        {
            timestamps: true,
            versionKey: false,
            collection: "blogs",
            toJSON: {
                virtuals: true,
            },
            toObject: {
                virtuals: true,
            },
        }
    );

BlogSchema.index(
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

BlogSchema.index({
    category: 1,
});

BlogSchema.index({
    tags: 1,
});

BlogSchema.index({
    author: 1,
});

BlogSchema.index({
    featured: 1,
});

BlogSchema.index({
    status: 1,
});

BlogSchema.index({
    publishedAt: -1,
});

BlogSchema.index({
    title: "text",
    excerpt: "text",
    content: "text",
});

BlogSchema.pre(
    "validate",
    function (
        this: BlogDocument
    ) {
        if (
            this.isModified(
                "title"
            ) || !this.slug
        ) {
            this.slug =
                generateSlug(
                    this.title
                );
        }
    }
);

BlogSchema.static(
    "findBySlug",
    function (
        slug: string
    ) {
        return this.findOne({
            slug,
            isDeleted: false,
        });
    }
);

BlogSchema.static(
    "findPublished",
    function () {
        return this.find({
            status:
                CONTENT_STATUS.PUBLISHED,
            isDeleted: false,
        });
    }
);

BlogSchema.static(
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

export const Blog =
    (models.Blog as BlogModel) ||
    model<
        IBlog,
        BlogModel
    >("Blog", BlogSchema);