import { Module } from '@nestjs/common';

import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getCatalogueGrpcClientOptions } from '../../client-options/catalogue.grpc-client';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CATALOGUE_PACKAGE',
        imports: [ConfigModule],
        useFactory: getCatalogueGrpcClientOptions,
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
  exports: [CatalogueService],
})
export class CatalogueModule { }
