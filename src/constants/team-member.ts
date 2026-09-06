import { TEAM_MEMBER_TEMPLATES } from "@/enums";

export const TEAM_MEMBER_SORT = {
  NEWEST: "-createdAt",
  OLDEST: "createdAt",
  NAME_ASC: "name",
  NAME_DESC: "-name",
  ORDER_ASC: "sortOrder",
  ORDER_DESC: "-sortOrder",
};

export const TEAM_MEMBER_DEFAULT_TEMPLATE =
  TEAM_MEMBER_TEMPLATES.DEFAULT;