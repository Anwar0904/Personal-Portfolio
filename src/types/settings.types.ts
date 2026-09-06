import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ISeo } from "./seo.types";
import { ISocialLinks } from "./social-links.types";

export interface IBranding {
  siteName: string;
  siteDescription: string;
  logo?: Types.ObjectId | null;
  favicon?: Types.ObjectId | null;
}

export interface IContact {
  email: string;
  phone: string;
  address: string;
}

export interface IFeatures {
  maintenanceMode: boolean;
  consultationEnabled: boolean;
  careersEnabled: boolean;
}

export interface ISettings {
  branding: IBranding;

  contact: IContact;

  social: ISocialLinks;

  seo: ISeo;

  features: IFeatures;

  analyticsId?: string;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface SettingsMethods { }

export interface SettingsStatics {
  getSettings(): Promise<SettingsDocument | null>;
}

export type SettingsDocument =
  HydratedDocument<ISettings, SettingsMethods>;

export type SettingsModel =
  Model<ISettings, {}, SettingsMethods> &
  SettingsStatics;