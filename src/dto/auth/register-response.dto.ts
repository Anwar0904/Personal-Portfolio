import { UserDto } from "../user/user.dto";

export class RegisterResponseDto {
  user: UserDto;

  constructor(user: UserDto) {
    this.user = user;
  }
}