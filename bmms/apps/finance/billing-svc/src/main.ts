import { NestFactory } from '@nestjs/core';
import { BillingSvcModule } from './billing-svc.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingSvcModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
