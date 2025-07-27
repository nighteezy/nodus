import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".production.env"
          : ".development.env",
    }),
    PrismaModule,
    UsersModule,
  ],
})
export class AppModule {}
