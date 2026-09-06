import { z } from "zod";

import {
    PermissionValues,
} from "@/constants/permissions";

import { USER_STATUS } from "@/enums";

const permissionSchema = z.enum(
    PermissionValues as [
        string,
        ...string[]
    ]
);

const statusSchema = z.enum([
    USER_STATUS.ACTIVE,
    USER_STATUS.INACTIVE,
    USER_STATUS.SUSPENDED,
] as const);

export const CreateRoleSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(2, "Role name must contain at least 2 characters.")
            .max(50, "Role name cannot exceed 50 characters.")
            .regex(
                /^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/,
                "Role name contains invalid characters."
            ),

        description: z
            .string()
            .trim()
            .max(
                500,
                "Description cannot exceed 500 characters."
            )
            .optional()
            .default(""),

        permissions: z
            .array(permissionSchema)
            .default([]),

        isDefault: z
            .boolean()
            .optional()
            .default(false),

        status: statusSchema
            .optional(),
    });

export const UpdateRoleSchema =
    z
        .object({
            name: z
                .string()
                .trim()
                .min(2)
                .max(50)
                .regex(
                    /^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/
                )
                .optional(),

            description: z
                .string()
                .trim()
                .max(500)
                .optional(),

            permissions: z
                .array(permissionSchema)
                .optional(),

            isDefault: z
                .boolean()
                .optional(),

            status: statusSchema
                .optional(),
        })
        .strict();

export const AssignRolePermissionsSchema =
    z.object({
        permissions: z
            .array(permissionSchema),
    });

export const RoleQuerySchema =
    z.object({
        search: z
            .string()
            .trim()
            .optional(),

        status: statusSchema
            .optional(),

        page: z.coerce
            .number()
            .int()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20),
    });