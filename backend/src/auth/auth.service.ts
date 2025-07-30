import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { Prisma, User } from "@prisma/client";

type UserWithRoles = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: true;
      };
    };
  };
}>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candicate = await this.userService.getUserByEmail(userDto.email);
    if (candicate) {
      throw new HttpException(
        "Пользователь с таким e-mail существует",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    const fullUser = await this.userService.getUserByEmail(user.email);
    if (!fullUser) {
      throw new HttpException(
        "Ошибка при создании пользователя",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return this.generateToken(fullUser);
  }

  private async generateToken(user: UserWithRoles) {
    const roles = user.roles.map((r) => r.role.name);
    const payload = { email: user.email, id: user.id, roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException("Неверный email или пароль");
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: "Некорректный e-mail или пароль",
    });
  }
}
