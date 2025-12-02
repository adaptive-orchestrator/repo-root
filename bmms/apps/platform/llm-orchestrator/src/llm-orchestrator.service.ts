import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';
import { LlmChatResponse } from './llm-orchestrator/llm-orchestrator.interface';
import { CodeSearchService } from './service/code-search.service';
import { LlmOutputValidator } from './validators/llm-output.validator';
import { HelmIntegrationService } from './service/helm-integration.service';
import { debug } from '@bmms/common';

const LLMReplySchema = z.object({
  proposal_text: z.string(),
  changeset: z.object({
    model: z.string(),
    features: z.array(
      z.object({
        key: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
      }),
    ),
    impacted_services: z.array(z.string()),
  }),
  metadata: z.object({
    intent: z.string(),
    confidence: z.number(),
    risk: z.enum(['low', 'medium', 'high']),
  }),
});

type LLMReply = z.infer<typeof LLMReplySchema>;

const SYSTEM_PROMPT = `You are an expert business analyst that converts Vietnamese business model requests into JSON ChangeSet for Kubernetes deployment automation.

**BUSINESS MODELS:**
1. **Retail Model**: One-time purchase, inventory management
   - Required services: OrderService, InventoryService
   - BillingService mode: ONETIME
   - Note: 1 OrderService handles ALL retail products via database (product_id)
   
2. **Subscription Model**: Recurring payment, subscription plans
   - Required services: SubscriptionService, PromotionService
   - BillingService mode: RECURRING
   - Note: 1 SubscriptionService handles ALL subscription plans via database
   
3. **Freemium Model**: Free tier with optional paid add-ons
   - Required services: SubscriptionService (with is_free=true), PromotionService
   - BillingService mode: FREEMIUM (free base + pay for add-ons)
   - Add-ons: Extra storage, premium features, etc. (charged separately)
   - Note: Same SubscriptionService handles free users + add-on purchases
   
4. **Freemium + Add-on Model**: Free base plan with purchasable add-ons
   - Base plan: Free (no billing)
   - Add-ons: Paid features billed separately (e.g., extra storage, AI features)
   - BillingService mode: ADDON (only bill for add-ons, not base subscription)
   
5. **Multi-Model**: Support multiple models simultaneously
   - Required services: ALL of the above
   - BillingService mode: HYBRID (handle all billing types)
   - Note: SHARED SERVICE PATTERN - Each service type deploys ONCE, not per product
   - Example: 2 retail products + 1 subscription → Still only 1 OrderService, 1 SubscriptionService

**CORE SERVICES (always needed):**
- AuthService, CustomerService, CRMOrchestratorService
- APIGatewayService
- CatalogueService (Product domain)
- BillingService, PaymentService (Finance domain)

**SERVICE MAPPING:**
- OrderService → order-svc (namespace: order, port: 3011)
- InventoryService → inventory-svc (namespace: order, port: 3013)
- SubscriptionService → subscription-svc (namespace: order, port: 3012)
- PromotionService → promotion-svc (namespace: product, port: 3009)
- CatalogueService → catalogue-svc (namespace: product, port: 3007)
- BillingService → billing-svc (namespace: finance, port: 3003)
- PaymentService → payment-svc (namespace: finance, port: 3015)
- AuthService → auth-svc (namespace: customer, port: 3000)
- CustomerService → customer-svc (namespace: customer, port: 3001)
- CRMOrchestratorService → crm-orchestrator (namespace: customer, port: 3002)
- APIGatewayService → api-gateway (namespace: platform, port: 3099)

**INTENT TYPES:**
- "business_model_change": Chuyển đổi từ model này sang model khác
- "business_model_expansion": Mở rộng để hỗ trợ nhiều models
- "update": Cập nhật config của services hiện tại
- "scale": Thay đổi số lượng replicas

**OUTPUT FORMAT:**
Return ONLY valid JSON in this exact format:
{
  "proposal_text": "Detailed explanation in Vietnamese about what changes are needed",
  "changeset": {
    "model": "BusinessModel|MultiBusinessModel|SubscriptionPlan|etc",
    "features": [
      {"key": "business_model", "value": "retail|subscription|freemium|multi"},
      {"key": "other_config_key", "value": "config_value"}
    ],
    "impacted_services": ["ServiceName1", "ServiceName2", ...]
  },
  "metadata": {
    "intent": "business_model_change|business_model_expansion|update|scale",
    "confidence": 0.85-0.99,
    "risk": "low|medium|high",
    "from_model": "retail|subscription|etc (if applicable)",
    "to_model": "subscription|multi|etc (if applicable)"
  }
}

**EXAMPLES:**

Example 1 - Retail to Subscription:
Input: "Chuyển sản phẩm Premium Plan sang subscription 199k/tháng"
Output: {
  "changeset": {
    "model": "BusinessModel",
    "features": [
      {"key": "business_model", "value": "subscription"},
      {"key": "subscription_price", "value": 199000}
    ],
    "impacted_services": ["SubscriptionService", "PromotionService", "BillingService", "PaymentService", "CatalogueService"]
  },
  "metadata": {
    "intent": "business_model_change",
    "from_model": "retail",
    "to_model": "subscription"
  }
}

Example 2 - Multi-Model with multiple products:
Input: "Hỗ trợ 2 retail products, 1 subscription, và 1 freemium"
Output: {
  "changeset": {
    "model": "MultiBusinessModel",
    "features": [
      {"key": "business_model", "value": "multi"},
      {"key": "supported_models", "value": "retail,subscription,freemium"},
      {"key": "retail_products_count", "value": 2},
      {"key": "subscription_plans_count", "value": 1},
      {"key": "freemium_enabled", "value": true}
    ],
    "impacted_services": ["OrderService", "InventoryService", "SubscriptionService", "PromotionService", "CatalogueService", "BillingService", "PaymentService", "APIGatewayService", "AuthService"]
  },
  "metadata": {
    "intent": "business_model_expansion",
    "to_model": "multi",
    "note": "SHARED SERVICE PATTERN: Each service in impacted_services list will be deployed ONCE (e.g., 1 OrderService handles both retail products, 1 SubscriptionService handles subscription + freemium)"
  }
}

Example 3 - Freemium with Add-ons:
Input: "Tạo gói Freemium miễn phí với 3 add-on tính phí: Extra Storage (50k/tháng), AI Assistant (100k/tháng), Priority Support (30k/tháng)"
Output: {
  "changeset": {
    "model": "FreemiumWithAddons",
    "features": [
      {"key": "business_model", "value": "freemium"},
      {"key": "base_plan_price", "value": 0},
      {"key": "addons_enabled", "value": true},
      {"key": "addon_extra_storage_price", "value": 50000},
      {"key": "addon_ai_assistant_price", "value": 100000},
      {"key": "addon_priority_support_price", "value": 30000}
    ],
    "impacted_services": ["SubscriptionService", "BillingService", "PaymentService", "CatalogueService", "AuthService"]
  },
  "metadata": {
    "intent": "business_model_change",
    "to_model": "freemium_addon",
    "billing_mode": "addon_only"
  }
}

Return ONLY the JSON, no markdown code blocks, no additional text.`;

@Injectable()
export class LlmOrchestratorService {
  [x: string]: any;
  private geminiClient: GoogleGenerativeAI;
  private useRAG = process.env.USE_RAG === 'true'; // 👈 Feature flag

  constructor(
    private codeSearchService: CodeSearchService,
    private validator: LlmOutputValidator,
    private helmIntegrationService: HelmIntegrationService,
  ) {
    this.geminiClient = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || '',
    );
  }

  async ask(
    message: string,
    tenant: string = 't-unknown',
    role: string = 'guest',
    lang: 'vi' | 'en' = 'vi',
  ): Promise<LlmChatResponse> {
     // 👇 RAG: Tìm code liên quan
    let codeContext = '';
    if (this.useRAG) {
      const relevantCode = await this.codeSearchService.searchRelevantCode(message, 3);
      
      if (relevantCode.length > 0) {
        codeContext = '\n\n=== RELEVANT CODE CONTEXT ===\n';
        relevantCode.forEach((code, idx) => {
          codeContext += `\n[${idx + 1}] ${code.file_path} (${code.chunk_type}${code.name ? `: ${code.name}` : ''})\n`;
          codeContext += `Score: ${code.score.toFixed(3)}\n`;
          codeContext += '```\n' + code.content.substring(0, 1000) + '\n```\n';
        });
        codeContext += '=== END CONTEXT ===\n';
      }
    }

    const content = await this.callGemini(message, tenant, role, lang, codeContext);

    // Clean code fence if present
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned
        .replace(/^```[a-zA-Z]*\n?/, '')
        .replace(/```$/, '')
        .trim();
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned
        .replace(/^```[a-zA-Z]*\n?/, '')
        .replace(/```$/, '')
        .trim();
    }

    // Write to file for debugging
    try {
      const dir = path.resolve(process.cwd(), 'llm_output');
      await mkdir(dir, { recursive: true });
      const outputPath = path.join(dir, `${Date.now()}_raw.json`);
      await writeFile(outputPath, cleaned, 'utf8');
      debug.log(`[LLM] Wrote clean JSON to: ${outputPath}`);
    } catch (err) {
      debug.error('[LLM] Failed to write output file:', err);
    }

    // Parse and validate JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = String(cleaned).match(/\{[\s\S]*\}/);
      if (!match) throw new Error('LLM did not return valid JSON');
      parsed = JSON.parse(match[0]);
    }

    const validated = LLMReplySchema.parse(parsed);

    // 👈 ADD: Business logic validation
    const validationResult = this.validator.validate(validated);
    
    if (!validationResult.isValid) {
      throw new Error(
        `LLM output validation failed:\n${validationResult.errors.join('\n')}`,
      );
    }
    
    // Log warnings if any
    if (validationResult.warnings.length > 0) {
      debug.log('[LLM Validator] Warnings:', validationResult.warnings.join('; '));
    }
    
    // Log metadata
    if (validationResult.metadata) {
      debug.log('[LLM Validator] Metadata:', JSON.stringify(validationResult.metadata, null, 2));
    }

    // Convert value to string for gRPC (proto expects string)
    const response: LlmChatResponse = {
      proposal_text: validated.proposal_text,
      changeset: {
        model: validated.changeset.model,
        features: validated.changeset.features.map((f) => ({
          key: f.key,
          value: String(f.value), // Convert to string for proto
        })),
        impacted_services: validated.changeset.impacted_services,
      },
      metadata: validated.metadata,
    };

    // 🚀 AUTO-TRIGGER HELM DEPLOYMENT
    // Automatically generate changeset and trigger Helm deployment after successful LLM processing
    try {
      const autoDeployEnabled = process.env.AUTO_DEPLOY_ENABLED === 'true';
      const dryRunDefault = process.env.DEFAULT_DRY_RUN !== 'false'; // Default: true
      
      if (autoDeployEnabled || dryRunDefault) {
        // Trigger Helm deployment in background (don't wait)
        this.helmIntegrationService.triggerDeployment(response, dryRunDefault)
          .then((result) => {
            if (result.success) {
              debug.log('[LLM] Helm changeset generated:', result.changesetPath);
              if (result.deployed) {
                debug.log('[LLM] Helm deployment completed successfully');
              }
            }
          })
          .catch(err => {
            debug.error('[LLM] Failed to trigger Helm deployment:', err.message);
          });
      }
    } catch (error) {
      // Don't fail the LLM request if deployment trigger fails
      debug.error('[LLM] Error triggering Helm deployment:', error instanceof Error ? error.message : String(error));
    }

    return response;
  }

  // -------------------------------
  // Gemini (Google API)
  // -------------------------------
  private async callGemini(
    message: string,
    tenant: string,
    role: string,
    lang: string,
    codeContext: string = '',
  ): Promise<string> {
    // Use LLM_MODEL from env, default to gemini-2.0-flash-exp
    const modelName = process.env.LLM_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    
    // 1. Cấu hình model với System Prompt
    const model = this.geminiClient.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT, // <-- Chỉ dẫn hệ thống đặt ở đây
    });

    // 2. Bắt đầu chat (không cần history vì đây là 1 shot)
    const chat = model.startChat();

    // 3. Tạo nội dung của User
     const userPrompt = `tenant_id=${tenant}; role=${role}; lang=${lang};
${codeContext}

Yêu cầu: ${message}`;

    // 4. Gửi tin nhắn của User
    const result = await chat.sendMessage(userPrompt);

    return result.response.text() || '{}';
  }

  // -------------------------------
  // AI Chat Methods
  // -------------------------------
  
  /**
   * Generate text response for AI chat
   */
  async generateText(prompt: string, context: any[]): Promise<string> {
    try {
      return await this.callGeminiChat(prompt, context, 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.');
    } catch (error) {
      debug.error('[AI Chat] Error:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  /**
   * Generate code based on prompt
   */
  async generateCode(prompt: string, context: any[]): Promise<{ code: string; language: string; explanation: string }> {
    const codeSystemPrompt = `You are an expert programmer. Generate clean, well-documented code based on user requests. 
Always respond in JSON format:
{
  "code": "the generated code here",
  "language": "programming language (e.g., python, javascript, typescript)",
  "explanation": "brief explanation of what the code does"
}`;

    try {
      const responseText = await this.callGeminiChat(prompt, context, codeSystemPrompt);

      // Parse JSON response
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleaned);
      return {
        code: parsed.code || '',
        language: parsed.language || 'python',
        explanation: parsed.explanation || 'Code generated successfully'
      };
    } catch (error) {
      debug.error('[Code Generation] Error:', error);
      return {
        code: '// Error generating code',
        language: 'text',
        explanation: 'Failed to generate code. Please try again with a clearer prompt.'
      };
    }
  }

  /**
   * Generic chat method for Gemini
   */
  private async callGeminiChat(prompt: string, context: any[], systemPrompt: string): Promise<string> {
    // Use LLM_MODEL from env, default to gemini-2.0-flash-exp
    const modelName = process.env.LLM_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    
    const model = this.geminiClient.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Build conversation history for Gemini
    const history = context.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);

    return result.response.text() || '';
  }

  // -------------------------------
  // Business Model Recommendation
  // -------------------------------
  
  /**
   * Tư vấn mô hình kinh doanh phù hợp dựa trên mô tả của người dùng
   */
  async recommendBusinessModel(request: {
    business_description: string;
    target_audience?: string;
    revenue_preference?: string;
    lang?: string;
  }): Promise<{
    greeting: string;
    recommendation_intro: string;
    recommended_model: string;
    why_this_fits: string;
    how_it_works: string;
    next_steps: string[];
    alternatives_intro?: string;
    alternatives?: Array<{ model: string; brief_reason: string }>;
    closing?: string;
  }> {
    const lang = request.lang || 'vi';
    
    const systemPrompt = `Bạn là một chuyên gia tư vấn kinh doanh thân thiện và nhiệt tình. Nhiệm vụ của bạn là giúp người dùng (có thể không biết gì về công nghệ hay mô hình kinh doanh) chọn được cách vận hành phù hợp nhất.

**CÁCH NÓI CHUYỆN:**
- Nói như đang tư vấn trực tiếp cho một người bạn
- Dùng ngôn ngữ đơn giản, tránh thuật ngữ chuyên môn  
- Giải thích bằng ví dụ thực tế dễ hiểu (Netflix, Shopee, phòng gym...)
- Thể hiện sự quan tâm và động viên

**CÁC LỰA CHỌN CÓ SẴN:**

1. **retail** - "Bán hàng truyền thống" ⭐ CHỌN NÀY KHI BÁN SẢN PHẨM VẬT LÝ
   - Khách mua → Thanh toán 1 lần → Nhận hàng → Xong
   - Giống như: Shopee, Tiki, cửa hàng điện tử, cửa hàng quần áo
   - PHÙ HỢP VỚI: Bán linh kiện, thiết bị, quần áo, thực phẩm, đồ gia dụng, sản phẩm handmade, v.v.
   - DẤU HIỆU NHẬN BIẾT: người dùng nói "bán", "kinh doanh", "cửa hàng", "sản phẩm", "hàng hóa", "ship", "giao hàng"
   
2. **subscription** - "Thu phí định kỳ" ⭐ CHỌN KHI CUNG CẤP DỊCH VỤ SỐ/NỘI DUNG
   - Khách đăng ký → Trả tiền hàng tháng/năm → Được sử dụng dịch vụ LIÊN TỤC
   - Giống như: Netflix, Spotify, phòng gym, SaaS, khóa học online membership
   - PHÙ HỢP VỚI: Streaming, phần mềm, nội dung số, dịch vụ cloud, membership
   - DẤU HIỆU NHẬN BIẾT: "hàng tháng", "định kỳ", "membership", "thành viên", "truy cập không giới hạn"
   
3. **freemium** - "Miễn phí cơ bản, trả tiền nâng cấp"
   - Khách dùng free → Thích → Trả tiền để có thêm tính năng
   - Giống như: Canva, Notion, game mobile
   - PHÙ HỢP VỚI: Ứng dụng, công cụ online, game
   - DẤU HIỆU NHẬN BIẾT: "miễn phí", "free", "nâng cấp", "premium features"
   
4. **multi** - "Kết hợp nhiều cách"
   - Vừa bán hàng, vừa có gói membership, vừa có tính năng premium
   - Giống như: Amazon (vừa bán hàng, vừa có Prime)
   - PHÙ HỢP VỚI: Doanh nghiệp lớn muốn đa dạng hóa nguồn thu

**QUAN TRỌNG - QUY TẮC CHỌN:**
- Nếu người dùng nói về BÁN SẢN PHẨM VẬT LÝ (linh kiện, điện tử, quần áo, đồ ăn, v.v.) → LUÔN chọn **retail**
- Chỉ chọn **subscription** khi họ nói rõ về DỊCH VỤ SỐ hoặc NỘI DUNG định kỳ
- Nếu không chắc chắn và sản phẩm là vật lý → mặc định chọn **retail**

**⚠️ BẮT BUỘC: PHẢI TRẢ VỀ TẤT CẢ 9 TRƯỜNG DƯỚI ĐÂY. KHÔNG ĐƯỢC BỎ QUA TRƯỜNG NÀO!**

**OUTPUT FORMAT (CHỈ JSON, KHÔNG markdown, KHÔNG code block):**
{
  "greeting": "[BẮT BUỘC] Lời chào thân thiện có emoji",
  "recommendation_intro": "[BẮT BUỘC] Giới thiệu ngắn về đề xuất, VD: 'Dựa vào mô tả của bạn, mình nghĩ cách phù hợp nhất là:'",
  "recommended_model": "[BẮT BUỘC] Chỉ 1 trong 4 giá trị: retail | subscription | freemium | multi",
  "why_this_fits": "[BẮT BUỘC] Giải thích 2-3 lý do TẠI SAO cách này phù hợp với mô tả của họ",
  "how_it_works": "[BẮT BUỘC] Giải thích CÁCH HOẠT ĐỘNG đơn giản với ví dụ thực tế",
  "next_steps": "[BẮT BUỘC] Mảng 3 bước tiếp theo, VD: ['Bấm chọn mô hình này', 'Thêm sản phẩm', 'Bắt đầu bán']",
  "alternatives_intro": "[BẮT BUỘC] VD: 'Nếu bạn chưa chắc chắn, đây là lựa chọn khác:'",
  "alternatives": "[BẮT BUỘC] Mảng 2 lựa chọn khác: [{'model': '...', 'brief_reason': '1 dòng mô tả'}]",
  "closing": "[BẮT BUỘC] Lời kết động viên"
}

**VÍ DỤ RESPONSE HOÀN CHỈNH:**
{"greeting":"Chào bạn! 😊","recommendation_intro":"Dựa vào việc bạn muốn bán linh kiện điện tử, mình đề xuất:","recommended_model":"retail","why_this_fits":"1. Linh kiện điện tử là sản phẩm vật lý, khách mua 1 lần và nhận hàng. 2. Giống như các shop Shopee/Tiki bán linh kiện - mô hình đã chứng minh hiệu quả. 3. Dễ quản lý tồn kho và định giá theo từng sản phẩm.","how_it_works":"Rất đơn giản: Bạn đăng linh kiện lên → Khách xem và đặt mua → Thanh toán → Bạn giao hàng. Giống như mở shop trên Shopee vậy!","next_steps":["Bấm chọn mô hình 'Bán hàng truyền thống'","Thêm các linh kiện của bạn vào kho","Bắt đầu nhận đơn hàng đầu tiên!"],"alternatives_intro":"Nếu sau này bạn muốn mở rộng:","alternatives":[{"model":"multi","brief_reason":"Kết hợp thêm gói membership VIP cho khách thường xuyên"},{"model":"subscription","brief_reason":"Nếu bạn có dịch vụ sửa chữa định kỳ"}],"closing":"Bắt đầu với retail là lựa chọn an toàn nhất cho việc bán linh kiện. Chúc bạn kinh doanh thành công! 🚀"}`;

    const userPrompt = `Người dùng cần tư vấn:

"${request.business_description}"
${request.target_audience ? `\nKhách hàng họ nhắm đến: "${request.target_audience}"` : ''}
${request.revenue_preference ? `\nHọ mong muốn về thu nhập: "${request.revenue_preference}"` : ''}

Hãy tư vấn thật thân thiện, dễ hiểu bằng ${lang === 'vi' ? 'tiếng Việt' : 'English'}. Giải thích như đang nói chuyện với một người bạn không biết gì về kinh doanh online. Nhớ trả lời đúng format JSON.`;

    try {
      const responseText = await this.callGeminiChat(userPrompt, [], systemPrompt);
      
      // Log raw response from Gemini
      console.log('[Recommend Model] Raw Gemini response:', responseText);
      
      // Clean and parse response
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }
      
      console.log('[Recommend Model] Cleaned response:', cleaned);
      
      const parsed = JSON.parse(cleaned);
      
      console.log('[Recommend Model] Parsed JSON keys:', Object.keys(parsed));
      console.log('[Recommend Model] Parsed JSON:', JSON.stringify(parsed, null, 2));
      
      const result = {
        greeting: parsed.greeting || 'Chào bạn! 😊',
        recommendation_intro: parsed.recommendation_intro || 'Dựa vào mô tả của bạn, mình đề xuất:',
        recommended_model: parsed.recommended_model || 'retail',
        why_this_fits: parsed.why_this_fits || 'Cách này sẽ phù hợp với nhu cầu của bạn.',
        how_it_works: parsed.how_it_works || 'Khách hàng sẽ mua sản phẩm/dịch vụ của bạn một cách dễ dàng.',
        next_steps: parsed.next_steps || ['Bấm nút bên dưới để bắt đầu'],
        alternatives_intro: parsed.alternatives_intro || 'Nếu bạn chưa chắc, đây là một số lựa chọn khác:',
        alternatives: parsed.alternatives || [],
        closing: parsed.closing || 'Chúc bạn kinh doanh thành công! 🚀',
      };
      
      console.log('[Recommend Model] Final result:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.log('[Recommend Model] Error:', error);
      console.log('[Recommend Model] Error details:', (error as Error).message);
      return {
        greeting: 'Chào bạn! 😊',
        recommendation_intro: 'Mình đã xem qua mô tả của bạn và đây là đề xuất:',
        recommended_model: 'retail',
        why_this_fits: 'Xin lỗi, mình không thể phân tích chi tiết được. Nhưng cách "Bán hàng truyền thống" là lựa chọn an toàn và dễ bắt đầu nhất.',
        how_it_works: 'Bạn đăng sản phẩm → Khách hàng xem và đặt mua → Thanh toán → Giao hàng. Đơn giản vậy thôi!',
        next_steps: [
          'Bấm nút bên dưới để chọn cách này',
          'Thêm sản phẩm/dịch vụ của bạn vào hệ thống',
          'Bắt đầu bán hàng!'
        ],
        closing: 'Bạn có thể thay đổi sang cách khác sau nếu cần nhé!',
      };
    }
  }
}

