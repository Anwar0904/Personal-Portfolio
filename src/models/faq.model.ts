import "@/models/user.model";

import {
    Schema,
    model,
    models,
} from "mongoose";

import {
    CONTENT_STATUS,
} from "@/enums";

import {
    IFAQManagement,
    FAQModel,
} from "@/types/faq.types";

const FAQSchema =
    new Schema<
        IFAQManagement,
        FAQModel
    >(
        {
            question: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 500,
            },

            answer: {
                type: String,
                required: true,
                trim: true,
            },

            status: {
                type: String,
                enum: Object.values(
                    CONTENT_STATUS
                ),
                default:
                    CONTENT_STATUS.DRAFT,
            },

            sortOrder: {
                type: Number,
                default: 0,
                min: 0,
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

            collection:
                "faqs",

            toJSON: {
                virtuals: true,
            },

            toObject: {
                virtuals: true,
            },
        }
    );

FAQSchema.index({
    status: 1,
});

FAQSchema.index({
    sortOrder: 1,
});

FAQSchema.index({
    question: "text",
    answer: "text",
});

export const FAQ =
    (models.FAQ as FAQModel) ||
    model<
        IFAQManagement,
        FAQModel
    >(
        "FAQ",
        FAQSchema
    );
