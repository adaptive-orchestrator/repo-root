import { NestFactory } from '@nestjs/core';
import { CustomerSvcModule } from './customer-svc.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env trực tiếp trước khi khởi động NestJS
dotenv.config({ 
  path: path.join(process.cwd(), 'apps/customer/customer-svc/.env') 
});

async function bootstrap() {
  const app = await NestFactory.create(CustomerSvcModule);
  
  app.setGlobalPrefix('api');
  console.log('✅ Customer Service running on http://localhost:3000/api');
  await app.listen(3000);
  
}
bootstrap();