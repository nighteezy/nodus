import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RolesModule } from "src/roles/roles.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
