import { UserDto } from "../user/user.dto";
import { TokenDto } from "./token.dto";

export class LoginResponseDto {
  user: UserDto;

  tokens: TokenDto;

  constructor(
    user: UserDto,
    tokens: TokenDto
  ) {
    this.user = user;

    this.tokens = tokens;
  }
}