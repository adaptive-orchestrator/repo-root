import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const billingGrpcOptions: ClientProviderOptions = {
  name: 'BILLING_PACKAGE',
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_SERVER_BILLING_URL || '127.0.0.1:50058',
    package: 'billing',
    protoPath: join(__dirname, '../proto/billing.proto'),
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  },
};
