
 import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { OrderSvcService } from './order-svc.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('api/v1/orders')
export class OrderSvcController {
  constructor(private readonly service: OrderSvcService) {}
  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }
  @Get()
  list() {
    return this.service.list();
  }
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.service.getById(id);
  }
  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body('status') status: UpdateStatusDto) {
    return this.service.updateStatus(id, status);
  }
  @Post(':id/items')
  addItem(@Param('id') id: number, @Body() dto: any) {
    return this.service.addItem(id, dto);
  }
  @Delete(':id/items/:itemId')
  deleteItem(@Param('id') id: number, @Param('itemId') itemId: number) {
    return this.service.deleteItem(id, itemId);
  }
}