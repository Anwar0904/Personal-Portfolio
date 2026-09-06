export const BLOG_SELECT_FIELDS =
    "-__v";

export const BLOG_POPULATE = [
    {
        path: "category",
        select: "name slug",
    },
    {
        path: "tags",
        select: "name slug color",
    },
    {
        path: "author",
        select: "name email avatar",
    },
    {
        path: "featuredImage",
    },
    {
        path: "gallery",
    },
    {
        path: "createdBy",
        select: "name email",
    },
    {
        path: "updatedBy",
        select: "name email",
    },
];