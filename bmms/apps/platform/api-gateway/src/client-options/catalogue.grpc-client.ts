import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getCatalogueGrpcClientOptions = (configService: ConfigService): ClientProviderOptions => ({
  name: 'CATALOGUE_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'catalogue',
    protoPath: join(__dirname, '../proto/catalogue.proto'),
    url: configService.get<string>('GRPC_SERVER_CATALOGUE_URL'),
  },
});
