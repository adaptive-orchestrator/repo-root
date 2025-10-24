import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { customerGrpcClientOptions } from '../../client-options/customer.grpc-client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CUSTOMER_PACKAGE',
        ...customerGrpcClientOptions,
      },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
