import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "src/roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    const role = await this.rolesService.getRoleByValue("ADMIN");
    if (!role) throw new Error("Role USER not found");
    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    const role = await this.rolesService.getRoleByValue(dto.value);
    if (role && user) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
      return dto;
    }
    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }
}
