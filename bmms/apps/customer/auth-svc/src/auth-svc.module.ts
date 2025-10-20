import { Module } from '@nestjs/common';
import { AuthSvcController } from './auth-svc.controller';
import { AuthSvcService } from './auth-svc.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from './mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from '@bmms/db';

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true,
        }),
        PassportModule,
        MailerModule,
        DbModule.forRoot({ prefix: 'CUSTOMER_SVC' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          
          useFactory: (configService: ConfigService) => ({
           secret: configService.get<string>('JWT_SECRET'),
           signOptions: { 
             expiresIn: configService.get<number>('TOKEN_EXPIRE_TIME') 
           },
         }),
        }),
    
        TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthSvcController],
  providers: [AuthSvcService],
})
export class AuthSvcModule {}
