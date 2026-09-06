import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  ISettings,
  SettingsModel,
} from "@/types/settings.types";



import { SeoSchema } from "@/schemas/seo.schema";
import { SocialLinksSchema } from "@/schemas/social.schema";
import "@/models/media.model";
import "@/models/user.model";

const SettingsSchema =
  new Schema<ISettings, SettingsModel>(
    {
      branding: {
        siteName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 120,
        },

        siteDescription: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300,
        },

        logo: {
          type: Schema.Types.ObjectId,
          ref: "Media",
          default: null,
        },

        favicon: {
          type: Schema.Types.ObjectId,
          ref: "Media",
          default: null,
        },
      },

      contact: {
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },
      },

      social: {
        type: SocialLinksSchema,
        required: true,
      },

      seo: {
        type: SeoSchema,
        required: true,
      },

      features: {
        maintenanceMode: {
          type: Boolean,
          default: false,
        },

        consultationEnabled: {
          type: Boolean,
          default: true,
        },

        careersEnabled: {
          type: Boolean,
          default: true,
        },
      },

      analyticsId: {
        type: String,
        default: "",
        trim: true,
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
      collection: "settings",
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

SettingsSchema.index({
  isDeleted: 1,
});

SettingsSchema.static("getSettings", function () {
  return this.findOne({
    isDeleted: false,
  });
});

SettingsSchema.pre("save", async function () {
  if (this.isNew) {
    const existing = await Settings.findOne();

    if (existing) {
      throw new Error(
        "Only one settings document is allowed."
      );
    }
  }
});

export const Settings =
  (models.Settings as SettingsModel) ||
  model<ISettings, SettingsModel>(
    "Settings",
    SettingsSchema
  );