
import { PERMISSIONS } from "@/constants/permissions";
import { roleRepository } from "@/repositories/role.repository";

export async function seedRoles() {
    const roles = [
        {
            name: "super admin",
            description: "System Administrator",
            permissions: Object.values(PERMISSIONS),
            isDefault: false,
        },
        {
            name: "admin",
            description: "Administrator",
            permissions: [
                PERMISSIONS.USER_READ,
                PERMISSIONS.USER_CREATE,
                PERMISSIONS.USER_UPDATE,
                PERMISSIONS.BLOG_READ,
                PERMISSIONS.BLOG_CREATE,
                PERMISSIONS.BLOG_UPDATE,
            ],
            isDefault: false,
        },
        {
            name: "editor",
            permissions: [
                PERMISSIONS.BLOG_READ,
                PERMISSIONS.BLOG_CREATE,
                PERMISSIONS.BLOG_UPDATE,
            ],
            isDefault: true,
        },
    ];

    for (const roleData of roles) {
        const role =
            await roleRepository.findByName(roleData.name);

        if (role) {
            await roleRepository.updateById(role._id, {
                description: roleData.description,
                permissions: roleData.permissions,
                isDefault: roleData.isDefault,
                status: "active",
            });
        } else {
            await roleRepository.create({
                ...roleData,
                status: "active",
            });
        }
    }
}