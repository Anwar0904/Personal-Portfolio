import { NextRequest } from "next/server";

import {
    CreateRoleSchema,
    RoleQuerySchema,
    UpdateRoleSchema,
    AssignRolePermissionsSchema,
} from "@/validators/role.validator";
import { roleService } from "@/services/role/role.service";

class RoleController {
    async findAll(
        request?: NextRequest
    ) {
        const searchParams =
            request
                ? Object.fromEntries(
                    request.nextUrl.searchParams
                )
                : {};

        const query =
            RoleQuerySchema.parse(
                searchParams
            );

        return roleService.getRoles(
            query
        );
    }

    async findById(id: string) {
        return roleService.getRoleById(
            id
        );
    }

    async create(
        request: NextRequest
    ) {
        const body =
            await request.json();

        const data =
            CreateRoleSchema.parse(
                body
            );

        return roleService.createRole(
            data
        );
    }

    async update(
        request: NextRequest,
        id: string
    ) {
        const body =
            await request.json();

        const data =
            UpdateRoleSchema.parse(
                body
            );

        return roleService.updateRole(
            id,
            data
        );
    }

    async delete(id: string) {
        return roleService.deleteRole(
            id
        );
    }

    async assignPermissions(
        request: NextRequest,
        id: string
    ) {
        const body =
            await request.json();

        const data =
            AssignRolePermissionsSchema.parse(
                body
            );

        return roleService.assignPermissions(
            id,
            data.permissions
        );
    }

    async setDefault(id: string) {
        return roleService.setDefaultRole(
            id
        );
    }
}

export const roleController =
    new RoleController();