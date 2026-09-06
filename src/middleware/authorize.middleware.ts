import { Role } from "@/models/role.model";
import { roleRepository } from "@/repositories/role.repository";

export async function authorize(
  userRoleId: string,
  ...permissions: string[]
) {
  const role = await Role.findById(userRoleId);

  if (!role) {
    throw new Error("Role not found.");
  }

  const hasPermission = permissions.some(permission =>
    role.hasPermission(permission)
  );

  if (!hasPermission) {
    throw new Error("Forbidden");
  }

  return true;
}