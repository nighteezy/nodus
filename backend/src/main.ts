import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function start() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<number>("PORT") || 3000;
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(
    `✅ Connected to DB: ${config.get("DB_NAME")} at ${config.get("DB_HOST")}:${config.get("DB_PORT")}`
  );
}
start();
