import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly name: string;
  readonly password: string;
}
