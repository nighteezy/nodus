import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "src/roles/roles.service";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    const role = await this.rolesService.getRoleByValue("USER");
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
}
