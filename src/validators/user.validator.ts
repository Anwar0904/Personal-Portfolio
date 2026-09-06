import { z } from "zod";

import { USER_STATUS } from "@/enums";

const email = z
    .string()
    .trim()
    .email("Invalid email address.")
    .transform((value) => value.toLowerCase());

const password = z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter."
    )
    .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter."
    )
    .regex(
        /[0-9]/,
        "Password must contain at least one number."
    )
    .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character."
    );

export const CreateUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2)
        .max(80),

    lastName: z
        .string()
        .trim()
        .max(80)
        .optional()
        .default(""),

    email,

    password,

    role: z
        .string()
        .min(1, "Role is required."),

    status: z
        .enum(
            Object.values(USER_STATUS) as [
                string,
                ...string[]
            ]
        )
        .optional(),

    phone: z
        .string()
        .trim()
        .max(30)
        .optional(),

    jobTitle: z
        .string()
        .trim()
        .max(120)
        .optional(),

    avatar: z
        .string()
        .nullable()
        .optional(),

    isEmailVerified: z
        .boolean()
        .optional(),
});

export const UpdateUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2)
        .max(80)
        .optional(),

    lastName: z
        .string()
        .trim()
        .max(80)
        .optional(),

    email: email.optional(),

    role: z
        .string()
        .min(1)
        .optional(),

    status: z
        .enum(
            Object.values(USER_STATUS) as [
                string,
                ...string[]
            ]
        )
        .optional(),

    phone: z
        .string()
        .trim()
        .max(30)
        .nullable()
        .optional(),

    jobTitle: z
        .string()
        .trim()
        .max(120)
        .nullable()
        .optional(),

    avatar: z
        .string()
        .nullable()
        .optional(),

    isEmailVerified: z
        .boolean()
        .optional(),
});

export const UserQuerySchema = z.object({
    page: z.coerce
        .number()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),

    search: z
        .string()
        .trim()
        .optional(),

    role: z
        .string()
        .optional(),

    status: z
        .enum(
            Object.values(USER_STATUS) as [
                string,
                ...string[]
            ]
        )
        .optional(),

    verified: z
        .coerce
        .boolean()
        .optional(),

    includeDeleted: z
        .coerce
        .boolean()
        .default(false),

    sort: z
        .string()
        .optional(),
});

export const ChangeUserStatusSchema = z.object({
    status: z.enum(
        Object.values(USER_STATUS) as [
            string,
            ...string[]
        ]
    ),
});