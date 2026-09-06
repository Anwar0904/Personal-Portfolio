import { IImage } from "./image.types";

export interface ISeo {
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: IImage;
  robots?: string;
  schemaMarkup?: Record<string, unknown>;
}