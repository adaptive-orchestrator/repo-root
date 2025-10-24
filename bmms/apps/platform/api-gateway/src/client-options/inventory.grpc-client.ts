import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getInventoryGrpcClientOptions = (configService: ConfigService): ClientProviderOptions => ({
  name: 'INVENTORY_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'inventory',
    protoPath: join(__dirname, '../proto/inventory.proto'),
    url: configService.get<string>('GRPC_SERVER_INVENTORY_URL'),
  },
});
