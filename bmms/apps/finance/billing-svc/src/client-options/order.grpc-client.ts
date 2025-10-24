import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getOrderGrpcClientOptions = (): ClientProviderOptions => ({
  name: 'ORDER_PACKAGE',
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_SERVER_ORDER_URL || '127.0.0.1:50057',
    package: 'order',
    protoPath: join(__dirname, '../proto/order.proto'),
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
});
