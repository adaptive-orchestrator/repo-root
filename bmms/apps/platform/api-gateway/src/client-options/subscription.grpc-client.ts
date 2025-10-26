import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const subscriptionGrpcOptions: ClientProviderOptions = {
  name: 'SUBSCRIPTION_PACKAGE',
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_SERVER_SUBSCRIPTION_URL || '127.0.0.1:50059',
    package: 'subscription',
    protoPath: join(__dirname, '../proto/subscription.proto'),
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
};
