import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const promotionGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'promotion',
    protoPath: join(__dirname, '../proto/promotion.proto'),
    url: process.env.GRPC_SERVER_PROMOTION_URL || 'localhost:50061',
  },
};
