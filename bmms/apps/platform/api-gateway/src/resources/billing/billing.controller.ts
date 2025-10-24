import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  Param, 
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';

@ApiTags('Invoices')
@Controller('invoices')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully', type: InvoiceResponseDto })
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.billingService.createInvoice(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async getAllInvoices() {
    return this.billingService.getAllInvoices();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice found', type: InvoiceResponseDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getInvoiceById(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.getInvoiceById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiResponse({ status: 200, description: 'Invoice status updated', type: InvoiceResponseDto })
  async updateInvoiceStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.billingService.updateInvoiceStatus(id, dto);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry payment for invoice' })
  @ApiResponse({ status: 200, description: 'Payment retry initiated' })
  async retryPayment(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.retryPayment(id);
  }
}
