import { ApiError } from "@/lib/api/api-error";
export class AuthorizationService {
    /**
     * Check if user has one of required roles
     */
    static hasRole(
        userRole: string,
        allowedRoles: string[]
    ) {
        if (!allowedRoles.includes(userRole)) {
            throw new ApiError(
                403,
                "You are not authorized to access this resource."
            );
        }
    }

    /**
     * Check permission
     */
    static hasPermission(
        userPermissions: string[],
        permission: string
    ) {
        if (!userPermissions.includes(permission)) {
            throw new ApiError(
                403,
                "Permission denied."
            );
        }
    }

    /**
     * Check multiple permissions
     */
    static hasAnyPermission(
        userPermissions: string[],
        permissions: string[]
    ) {
        const allowed = permissions.some((permission) =>
            userPermissions.includes(permission)
        );

        if (!allowed) {
            throw new ApiError(
                403,
                "Permission denied."
            );
        }
    }

    /**
     * Super Admin bypass
     */
    static isSuperAdmin(roleName: string) {
        return roleName
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, "_") === "super_admin";
    }
}