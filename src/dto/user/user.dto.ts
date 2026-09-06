import { UserDocument } from "@/types/user.types";

export class UserDto {
  id: string;

  name: string;

  email: string;

  avatar: unknown;

  role: unknown;

  status: string;

  constructor(user: UserDocument) {
    this.id = user._id.toString();

    this.name = `${user.firstName} ${user.lastName}`.trim();

    this.email = user.email;

    this.avatar = user.avatar;

    this.role = user.role;

    this.status = user.status;
  }
}