import { Schema } from "mongoose";
import { ISocialLinks } from "@/types/social-links.types";

export const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    facebook: String,
    instagram: String,
    linkedin: String,
    x: String,
    youtube: String,
    github: String,
  },
  {
    _id: false,
    versionKey: false,
  }
);