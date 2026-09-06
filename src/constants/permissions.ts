export const PERMISSIONS = {
  BLOG_READ: "blog.read",
  BLOG_CREATE: "blog.create",
  BLOG_UPDATE: "blog.update",
  BLOG_DELETE: "blog.delete",

  USER_READ: "user.read",
  USER_CREATE: "user.write",
  USER_UPDATE: 'user.update',
  USER_DELETE: "user.delete",

  ROLE_READ: "role.read",
  ROLE_CREATE: "role.write",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",

  SERVICE_READ: "service.read",
  SERVICE_CREATE: 'service.create',
  SERVICE_UPDATE: "service.update",
  SERVICE_DELETE: "service.delete",

  PORTFOLIO_READ: "portfolio.read",
  PORTFOLIO_CREATE: "portfolio.create",
  PORTFOLIO_UPDATE: "portfolio.update",
  PORTFOLIO_DELETE: "portfolio.delete",

  MEDIA_READ: "media.read",
  MEDIA_CREATE: "media.create",
  MEDIA_UPDATE: "media.update",
  MEDIA_DELETE: "media.delete",

  CATEGORY_READ: "category.read",
  CATEGORY_CREATE: "category.create",
  CATEGORY_UPDATE: "category.update",
  CATEGORY_DELETE: "category.delete",

  CONSULTATION_READ: "consultation.read",
  CONSULTATION_CREATE: "consultation.create",
  CONSULTATION_UPDATE: "consultation.update",
  CONSULTATION_DELETE: "consultation.delete",

  TAG_READ: "tag.read",
  TAG_CREATE: "tag.create",
  TAG_UPDATE: "tag.update",
  TAG_DELETE: "tag.delete",

  INDUSTRY_READ: "industry.read",
  INDUSTRY_CREATE: "industry.create",
  INDUSTRY_UPDATE: "industry.update",
  INDUSTRY_DELETE: "industry.delete",

  PAGE_READ: "page.read",
  PAGE_CREATE: "page.create",
  PAGE_UPDATE: "page.update",
  PAGE_DELETE: "page.delete",

  TESTIMONIAL_READ: "testimonial.read",
  TESTIMONIAL_CREATE: "testimonial.create",
  TESTIMONIAL_UPDATE: "testimonial.update",
  TESTIMONIAL_DELETE: "testimonial.delete",

  FAQ_READ: "faq.read",
  FAQ_CREATE: "faq.create",
  FAQ_UPDATE: "faq.update",
  FAQ_DELETE: "faq.delete",

  TEAM_MEMBER_READ: "team_member.read",
  TEAM_MEMBER_CREATE: "team_member.create",
  TEAM_MEMBER_UPDATE: "team_member.update",
  TEAM_MEMBER_DELETE: "team_member.delete",

  LEAD_READ: "lead.read",
  LEAD_CREATE: "lead.create",
  LEAD_UPDATE: "lead.update",
  LEAD_DELETE: "lead.delete",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export const PermissionValues = Object.values(PERMISSIONS);
