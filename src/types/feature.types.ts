import { IImage } from "./image.types";

export interface IFeature {
  title: string;
  description: string;
  icon?: IImage | null;
}
