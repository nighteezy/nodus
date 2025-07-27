import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  readonly password: string;

  @IsString()
  name: string;
}
