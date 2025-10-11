import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CustomerSvcService } from './customer-svc.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
@Controller('customers')  // ← Thêm 'customers' vào đây
export class CustomerSvcController {
  constructor(private readonly service: CustomerSvcService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCustomerDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/segment')
  updateSegment(@Param('id') id: number, @Body('segment') segment: string) {
    return this.service.updateSegment(id, segment);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}