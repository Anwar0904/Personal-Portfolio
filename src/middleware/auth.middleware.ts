import { NextRequest } from "next/server";

import { getUserFromToken } from "@/lib/auth/get-user";
import { ApiError } from "@/lib/api/api-error";
import { AuthorizationService } from "@/lib/auth/authorization";

type RoleLike = {
    name: string;
    permissions: string[];
};

function isRoleLike(role: unknown): role is RoleLike {
    if (typeof role !== "object" || role === null) {
        return false;
    }

    const candidate = role as Partial<RoleLike>;

    return typeof candidate.name === "string" && Array.isArray(candidate.permissions);
}

export async function requireAuth(
    request: NextRequest
) {
    const authorization =
        request.headers.get("authorization") ??
        (() => {
            const accessToken =
                request.cookies.get(
                    "adm_access_token"
                )?.value;

            return accessToken
                ? `Bearer ${accessToken}`
                : null;
        })();

    return getUserFromToken(
        authorization
    );
}

export async function requireRole(
    request: NextRequest,
    roles: string[]
) {
    const user = await requireAuth(request);

    const role = isRoleLike(user.role)
        ? user.role.name
        : null;

    if (!role) {
        throw new ApiError(
            403,
            "Role not loaded."
        );
    }

    AuthorizationService.hasRole(
        role,
        roles
    );

    return user;
}

export async function requirePermission(
    request: NextRequest,
    permission: string
) {
    const user = await requireAuth(request);

    if (!isRoleLike(user.role)) {
        throw new ApiError(
            403,
            "Role not loaded."
        );
    }

    if (
        AuthorizationService.isSuperAdmin(
            user.role.name
        )
    ) {
        return user;
    }

    AuthorizationService.hasPermission(
        user.role.permissions,
        permission
    );

    return user;
}

export async function requireAnyPermission(
    request: NextRequest,
    permissions: string[]
) {
    const user = await requireAuth(request);

    if (!isRoleLike(user.role)) {
        throw new ApiError(
            403,
            "Role not loaded."
        );
    }

    if (
        AuthorizationService.isSuperAdmin(
            user.role.name
        )
    ) {
        return user;
    }

    AuthorizationService.hasAnyPermission(
        user.role.permissions,
        permissions
    );

    return user;
}