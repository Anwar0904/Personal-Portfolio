import { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/api-error";

import { getUserFromToken } from "./get-user";
import { AuthorizationService } from "./authorization";


type RoleLike = {
    name: string;
    permissions: string[];
};

function isRoleLike(
    role: unknown
): role is RoleLike {
    return (
        typeof role === "object" &&
        role !== null &&
        "name" in role &&
        "permissions" in role
    );
}

export async function requireAuth(
    request: NextRequest
) {
    const authorization =
        request.headers.get(
            "authorization"
        ) ?? (() => {
            const accessToken =
                request.cookies.get(
                    "adm_access_token"
                )?.value;

            return accessToken
                ? `Bearer ${accessToken}`
                : null;
        })();

    if (!authorization) {
        throw new ApiError(
            401,
            "Authorization header is missing."
        );
    }

    const user =
        await getUserFromToken(
            authorization
        );

    if (!user) {
        throw new ApiError(
            401,
            "Unauthorized."
        );
    }

    return user;
}

export async function requireRole(
    request: NextRequest,
    roles: string[]
) {
    const user =
        await requireAuth(request);

    if (
        !isRoleLike(user.role)
    ) {
        throw new ApiError(
            403,
            "Role not loaded."
        );
    }

    AuthorizationService.hasRole(
        user.role.name,
        roles
    );

    return user;
}

export async function requirePermission(
    request: NextRequest,
    permission: string
) {
    const user =
        await requireAuth(request);

    if (
        !isRoleLike(user.role)
    ) {
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
    const user =
        await requireAuth(request);

    if (
        !isRoleLike(user.role)
    ) {
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