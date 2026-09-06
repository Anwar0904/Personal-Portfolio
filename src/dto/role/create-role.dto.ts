export interface CreateRoleDto {
    name: string;
    description?: string;
    permissions: string[];
    isDefault?: boolean;
}