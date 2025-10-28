import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtGuard } from '../../guards/jwt.guard';

import { LlmChatRequestDto } from './dto/llm-chat-request.dto';
import {
  LlmChatResponseDto,
  LlmErrorResponseDto,
} from './dto/response.dto';
import { LlmOrchestratorService } from './llm-orchestrator.service';

@ApiTags('LLM Orchestrator')
@ApiBearerAuth('accessToken')
@Controller('llm-orchestrator')
export class LlmOrchestratorController {
  constructor(
    private readonly llmOrchestratorService: LlmOrchestratorService,
  ) {}

  @Post('chat')
  // Có thể bật/tắt guard JWT tùy môi trường
  // @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a single business request to LLM orchestrator',
    description:
      'Phân tích câu lệnh nghiệp vụ tự nhiên và sinh ra bản proposal kèm changeset có cấu trúc.',
  })
  @ApiBody({ type: LlmChatRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Response chứa đề xuất và changeset',
    type: LlmChatResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Thiếu hoặc sai định dạng dữ liệu đầu vào',
    type: LlmErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: LlmErrorResponseDto,
  })
  async chatOnce(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: LlmChatRequestDto,
  ) {
    const { message, tenant_id, role, lang } = body;
    return this.llmOrchestratorService.ask(
      message,
      tenant_id,
      role,
      lang ?? 'vi',
    );
  }

  @Post('chat-and-deploy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chat with LLM and trigger K8s deployment (via gRPC + Kafka)',
    description: 'Phân tích nghiệp vụ qua gRPC. LLM tự động publish Kafka event. Dùng ?dryRun=true để chỉ sinh YAML.',
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Tôi muốn 2 sản phẩm retail và 1 gói subscription' },
        tenant_id: { type: 'string', example: 't-customer-123' },
        role: { type: 'string', example: 'admin' },
        lang: { type: 'string', enum: ['vi', 'en'], example: 'vi' },
      },
      required: ['message'],
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Response chứa LLM output. Kafka event được publish tự động.',
  })
  async chatAndDeploy(
    @Body(new ValidationPipe({ whitelist: true }))
    body: LlmChatRequestDto,
    @Query('dryRun') dryRun?: string,
  ) {
    const { message, tenant_id, role, lang } = body;
    
    // Call LLM via gRPC
    // LLM will automatically trigger Kafka deployment after processing
    const llmResponse = await this.llmOrchestratorService.ask(
      message,
      tenant_id,
      role,
      lang ?? 'vi',
    );

    return {
      llm: llmResponse,
      deployment: {
        message: 'Deployment event will be published automatically by LLM service',
        mode: dryRun === 'true' ? 'DRY-RUN (YAML only)' : 'FULL (Apply to K8s)',
        note: 'Check LLM Orchestrator and K8s Generator logs for deployment status',
      },
    };
  }
}
