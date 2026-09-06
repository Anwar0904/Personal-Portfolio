import { USER_STATUS } from "@/enums";

export interface UpdateRoleDto {
    name?: string;
    description?: string;
    permissions?: string[];
    isDefault?: boolean;
    status?: (typeof USER_STATUS)[keyof typeof USER_STATUS];
}