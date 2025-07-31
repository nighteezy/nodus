import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email: string;

  @IsString({ message: "Должно быть строкой" })
  readonly name: string;

  @IsString()
  @Length(6, 16, {
    message: "Пароль должен содержать не меньше 6 символов и не больше 16",
  })
  readonly password: string;
}
