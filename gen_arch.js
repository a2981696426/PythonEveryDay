const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

const C_BLUE = "1A3A5C"; const C_MID = "2E75B6"; const C_LIGHT = "D6E4F0";
const C_WHITE = "FFFFFF"; const C_GRAY = "333333"; const C_GREEN = "1E6B42";
const C_ORANGE = "C55A00";

const thin = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const allB = { top: thin, bottom: thin, left: thin, right: thin };

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: t, bold: true, color: C_WHITE, size: 30 })],
  shading: { fill: C_BLUE, type: ShadingType.CLEAR },
  spacing: { before: 360, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C_MID } } });

const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text: t, bold: true, color: C_MID, size: 26 })],
  spacing: { before: 280, after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C_LIGHT } } });

const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text: t, bold: true, color: C_GRAY, size: 24 })],
  spacing: { before: 180, after: 100 } });

const body = (t) => new Paragraph({ children: [new TextRun({ text: t, size: 22, color: C_GRAY })], spacing: { after: 100 } });
const bullet = (t, lv=0) => new Paragraph({ numbering: { reference: "bul", level: lv },
  children: [new TextRun({ text: t, size: 22, color: C_GRAY })], spacing: { after: 60 } });
const note = (t) => new Paragraph({ children: [new TextRun({ text: t, size: 20, italics: true, color: "888888" })],
  spacing: { after: 80 }, indent: { left: 360 } });
const blank = () => new Paragraph({ children: [new TextRun("")], spacing: { after: 80 } });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const mkTable = (cols, widths, rows) => {
  const total = widths.reduce((a,b)=>a+b,0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: cols.map((c,i) => new TableCell({
        borders: allB, width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: C_BLUE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, color: C_WHITE, size: 20 })] })]
      })) }),
      ...rows.map((r,ri) => new TableRow({ children: r.map((c,i) => new TableCell({
        borders: allB, width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: ri%2===0?"F0F5FB":"FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, color: C_GRAY })] })]
      })) }))
    ]
  });
};

// ── ASCII 架构图（代码块样式表格） ──────────────────────────────
const codeBlock = (lines) => lines.map(l => new Paragraph({
  children: [new TextRun({ text: l, font: "Courier New", size: 18, color: "1A1A1A" })],
  shading: { fill: "F4F6F8", type: ShadingType.CLEAR },
  spacing: { after: 20 },
  indent: { left: 360 }
}));

const doc = new Document({
  numbering: {
    config: [
      { reference: "bul", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
      ]},
      { reference: "num", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }
      ]}
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 },
      margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
    headers: { default: new Header({ children: [new Paragraph({
      children: [new TextRun({ text: "ClawCS \u667a\u80fd\u4e91\u5ba2\u670d\u5e73\u53f0 \u2014 \u6280\u672f\u67b6\u6784\u8bbe\u8ba1\u6587\u6863 v1.0", size: 18, color: "999999" }),
                new TextRun({ text: "\t\u5185\u90e8\u6587\u4ef6", size: 18, color: "BBBBBB" })],
      tabStops: [{ type: "right", position: 9026 }],
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } }
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      children: [new TextRun({ text: "\u00a9 2026 ClawCS  ", size: 18, color: "AAAAAA" }),
                new TextRun({ text: "\t\u7b2c ", size: 18, color: "AAAAAA" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "AAAAAA" }),
                new TextRun({ text: " \u9875", size: 18, color: "AAAAAA" })],
      tabStops: [{ type: "right", position: 9026 }],
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } }
    })] }) },
    children: [

      // ── 封面 ──────────────────────────────────────────────
      blank(), blank(), blank(),
      new Paragraph({ children: [new TextRun({ text: "ClawCS \u667a\u80fd\u4e91\u5ba2\u670d\u5e73\u53f0", bold: true, size: 56, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "\u6280\u672f\u67b6\u6784\u8bbe\u8ba1\u6587\u6863", size: 40, color: C_MID })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: "Technical Architecture Design Document", size: 26, color: "999999", italics: true })],
        alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      mkTable(["版本","状态","创建日期","作者"],[2256,2256,2256,2758],[["v1.0","草稿","2026-03-24","技术架构组"]]),
      pageBreak(),

      // ── 1. 概述 ──────────────────────────────────────────
      h1("1. 文档概述"),
      body("本文档描述 ClawCS 智能云客服平台的整体技术架构，包括系统分层设计、核心模块详解、技术选型决策、数据流设计、部署方案及关键技术实现要点，供研发团队实施参考。"),
      h2("1.1 架构设计原则"),
      bullet("高可用：SLA 99.9%，关键服务多副本冗余"),
      bullet("可扩展：微服务化，支持水平扩展；LLM 层抽象，可替换大模型"),
      bullet("安全合规：租户数据严格隔离，全链路加密，支持私有化部署"),
      bullet("可观测：全链路追踪（OpenTelemetry），结构化日志，实时指标告警"),
      bullet("成本优化：语义缓存复用 LLM 结果，RAG 减少 Token 消耗"),
      pageBreak(),

      // ── 2. 系统总体架构 ────────────────────────────────────
      h1("2. 系统总体架构"),
      h2("2.1 五层架构模型"),
      body("ClawCS 采用五层架构设计，各层职责清晰，支持独立扩展："),
      blank(),
      ...codeBlock([
        "  ┌─────────────────────────────────────────────────────────────┐",
        "  │              第一层：渠道接入层  (Channel Gateway)              │",
        "  │   Web Widget │ iOS/Android SDK │ 微信小程序 │ 企业微信 │ 邮件    │",
        "  └─────────────────────────┬───────────────────────────────────┘",
        "                            │ WebSocket / SSE / REST",
        "  ┌─────────────────────────▼───────────────────────────────────┐",
        "  │           第二层：API 网关 & 会话管理层                          │",
        "  │   Kong Gateway │ JWT 认证 │ 限流 │ 路由 │ Session Manager       │",
        "  └──────┬──────────────┬──────────────┬────────────────────────┘",
        "         │              │              │",
        "  ┌──────▼──────┐ ┌────▼──────┐ ┌────▼───────────────────────┐",
        "  │ 第三层：      │ │ 第三层：    │ │ 第三层：                      │",
        "  │ LLM 引擎服务  │ │ 知识库服务   │ │ 业务逻辑服务                  │",
        "  │ LLM Proxy    │ │ RAG Engine  │ │ 工单/坐席/权限/通知           │",
        "  │ Claude API   │ │ Milvus/     │ │                           │",
        "  │ 语义缓存      │ │ Chroma      │ │                           │",
        "  └──────┬──────┘ └────┬──────┘ └────┬───────────────────────┘",
        "         └──────────────┴──────────────┘",
        "                            │",
        "  ┌─────────────────────────▼───────────────────────────────────┐",
        "  │              第四层：数据存储层                                  │",
        "  │  PostgreSQL(主库) │ Redis(缓存) │ Milvus(向量) │ MinIO(文件)    │",
        "  └─────────────────────────────────────────────────────────────┘",
        "  ┌─────────────────────────────────────────────────────────────┐",
        "  │              第五层：基础设施层                                  │",
        "  │   Kubernetes │ Docker │ OpenTelemetry │ Prometheus │ Grafana  │",
        "  └─────────────────────────────────────────────────────────────┘",
      ]),
      blank(),

      h2("2.2 技术选型总表"),
      mkTable(
        ["层次","组件","选型","选型理由"],
        [1400, 1800, 2200, 4126],
        [
          ["API 网关","网关","Kong OSS","支持插件化限流/JWT/日志，生产成熟"],
          ["后端框架","Web 服务","FastAPI (Python)","原生异步，完美适配 SSE 流式输出，自动生成 OpenAPI"],
          ["LLM 引擎","主模型","Anthropic Claude claude-3-5-sonnet","200K 上下文，低幻觉，Tool Use 原生支持"],
          ["LLM 引擎","降级模型","OpenAI GPT-4o / DeepSeek-V3","Claude 不可用时自动切换"],
          ["知识检索","Embedding","text-embedding-3-large (OpenAI)","高精度多语言 Embedding"],
          ["向量数据库","存储","Milvus v2.x","百万级向量检索，支持 HNSW 索引"],
          ["缓存","语义缓存","Redis + Sentence-Transformers","相似问题复用，降低 LLM 调用 60%+"],
          ["主数据库","关系型","PostgreSQL 16","ACID，Row-level Security 多租户隔离"],
          ["文件存储","对象存储","MinIO (私有化) / OSS","知识库文件存储"],
          ["消息队列","异步任务","Celery + Redis Broker","知识库异步索引，工单异步通知"],
          ["前端","对话 UI","Vue 3 + Vite","轻量，SSE 支持好；管理后台 Ant Design Vue"],
          ["容器编排","部署","Kubernetes (K8s)","水平扩缩容，滚动更新"],
          ["可观测","追踪","OpenTelemetry + Jaeger","全链路追踪，快速定位 LLM 延迟"],
          ["可观测","监控","Prometheus + Grafana","指标采集与告警"],
        ]
      ),
      pageBreak(),

      // ── 3. 核心模块详解 ────────────────────────────────────
      h1("3. 核心模块详解"),
      h2("3.1 LLM 引擎服务（LLM Proxy）"),
      h3("3.1.1 职责"),
      body("统一封装对外部 LLM 的调用，提供：模型路由（主/降级）、请求排队与重试、语义缓存、流式透传、Token 计量、安全过滤（Prompt 注入检测）。"),
      h3("3.1.2 语义缓存工作流"),
      ...codeBlock([
        "  用户输入 Query",
        "       │",
        "       ▼",
        "  Embedding 向量化 (text-embedding-3-large)",
        "       │",
        "       ▼",
        "  Redis 向量相似度搜索 (cosine similarity >= 0.92 阈值)",
        "       │",
        "    命中?─── YES ──► 直接返回缓存响应 (P99 < 50ms)",
        "       │",
        "      NO",
        "       │",
        "       ▼",
        "  调用 Claude API (SSE 流式)",
        "       │",
        "       ▼",
        "  写入 Redis 缓存 (TTL = 24h)",
        "       │",
        "       ▼",
        "  流式透传给客户端",
      ]),
      blank(),
      h3("3.1.3 Tool Use 工具集定义"),
      mkTable(
        ["工具名","描述","集成系统"],
        [2500, 4000, 3026],
        [
          ["query_order","查询订单状态与物流","ERP/OMS"],
          ["create_ticket","创建支持工单","工单系统"],
          ["lookup_account","查询账户信息","CRM"],
          ["search_knowledge","搜索内部知识库（备用）","KB 服务"],
          ["get_product_info","查询商品详情与库存","商品中心"],
          ["send_notification","触发消息通知（短信/邮件）","通知服务"],
        ]
      ),
      blank(),

      h2("3.2 RAG 知识库引擎"),
      h3("3.2.1 文档处理流水线"),
      ...codeBlock([
        "  原始文件 (PDF/DOCX/URL)",
        "       │",
        "       ▼",
        "  文档解析 (PyMuPDF / docx2txt / BeautifulSoup)",
        "       │",
        "       ▼",
        "  分块切割 (Chunk Size=512 token, Overlap=64 token)",
        "       │",
        "       ▼",
        "  OCR (图片/扫描件, PaddleOCR)",
        "       │",
        "       ▼",
        "  Embedding (text-embedding-3-large 1536维)",
        "       │",
        "       ▼",
        "  写入 Milvus 向量库 + PostgreSQL 元数据",
        "       │",
        "       ▼",
        "  索引构建完成，通知管理员",
      ]),
      blank(),
      h3("3.2.2 检索策略"),
      body("采用混合检索（Hybrid Search）：向量检索 + BM25 关键词检索，结果通过 RRF（Reciprocal Rank Fusion）融合排序，取 Top-5 片段注入 Claude 上下文。"),
      mkTable(
        ["检索方式","权重","适用场景"],
        [2500, 1500, 5526],
        [
          ["向量语义检索 (Milvus HNSW)","0.7","语义相似问题，长尾问题，同义词处理"],
          ["BM25 关键词检索","0.3","精确术语、型号、订单号等关键词匹配"],
        ]
      ),
      blank(),

      h2("3.3 会话管理服务"),
      h3("3.3.1 会话状态机"),
      ...codeBlock([
        "  [INIT] ──► [AI_ACTIVE] ──► [TRANSFER_PENDING] ──► [HUMAN_ACTIVE]",
        "                │                                          │",
        "                └──────────────────────────────────► [RESOLVED]",
        "                                                           │",
        "                                                     [ARCHIVED]",
      ]),
      blank(),
      h3("3.3.2 上下文管理策略"),
      body("当对话轮次超过 20 轮时，使用 Claude 对历史对话做渐进式摘要压缩（Sliding Window Summary），保留最近 5 轮原文 + 历史摘要，控制总 Token 消耗。"),
      blank(),

      h2("3.4 多渠道接入网关"),
      mkTable(
        ["渠道","协议","接入方式","特殊处理"],
        [1800, 1400, 3000, 3326],
        [
          ["Web 悬浮窗","WebSocket","JS SDK + CDN","支持文件上传，跨域 CORS 配置"],
          ["移动 APP","REST + SSE","iOS/Android SDK (CocoaPods/Maven)","推送通知（APNs/FCM）"],
          ["微信小程序","WebSocket","小程序 SDK","消息格式适配，文件上传走 OSS"],
          ["企业微信","REST + Webhook","企业微信应用 API","消息卡片格式适配"],
          ["邮件","IMAP/SMTP","Email Listener 服务","线程关联，异步回复"],
        ]
      ),
      pageBreak(),

      // ── 4. 数据库设计 ──────────────────────────────────────
      h1("4. 数据库设计概览"),
      h2("4.1 核心数据模型（PostgreSQL）"),
      mkTable(
        ["表名","主要字段","说明"],
        [2200, 4500, 2826],
        [
          ["tenants","id, name, plan, claude_api_key(enc), settings","租户主表，多租户隔离基础"],
          ["users","id, tenant_id, role, email, password_hash","用户账户，role: customer/agent/admin"],
          ["sessions","id, tenant_id, user_id, channel, status, started_at","对话会话"],
          ["messages","id, session_id, role, content(enc), tokens, created_at","消息记录，content 加密存储"],
          ["knowledge_docs","id, tenant_id, title, source_type, status, chunk_count","知识库文档元数据"],
          ["tickets","id, session_id, type, priority, status, assignee_id","工单系统"],
          ["llm_usage","id, tenant_id, model, prompt_tokens, completion_tokens, cost, ts","Token 计量"],
          ["agent_configs","id, tenant_id, system_prompt, tools_enabled, temperature","AI 配置"],
        ]
      ),
      blank(),

      h2("4.2 向量数据库设计（Milvus）"),
      mkTable(
        ["Collection","字段","索引类型","说明"],
        [2000, 3500, 2000, 2026],
        [
          ["kb_chunks","chunk_id, tenant_id, doc_id, vector(1536d), content, metadata","HNSW, M=16, efConstruction=200","知识库文本块向量"],
          ["semantic_cache","cache_id, tenant_id, query_vector(1536d), response, created_at","IVF_FLAT","语义缓存向量索引"],
        ]
      ),
      pageBreak(),

      // ── 5. API 设计规范 ────────────────────────────────────
      h1("5. API 设计规范"),
      h2("5.1 API 风格与规范"),
      bullet("遵循 RESTful 设计原则，资源名使用复数名词"),
      bullet("版本化：所有 API 路径前缀 /api/v1/"),
      bullet("认证：JWT Bearer Token（access_token 2h 过期，refresh_token 7d）"),
      bullet("响应格式统一：{ code, message, data, request_id }"),
      bullet("错误码：HTTP 状态码 + 业务 error_code 双层设计"),
      blank(),

      h2("5.2 核心 API 端点"),
      mkTable(
        ["方法","路径","描述","认证"],
        [800, 3500, 3200, 1026],
        [
          ["POST","/api/v1/sessions","创建新对话会话","可选（匿名支持）"],
          ["GET","/api/v1/sessions/{id}/messages","获取会话消息历史","必须"],
          ["POST","/api/v1/sessions/{id}/messages","发送消息（SSE 流式响应）","可选"],
          ["POST","/api/v1/sessions/{id}/transfer","请求转接人工坐席","必须"],
          ["GET","/api/v1/sessions/{id}/messages (SSE)","订阅实时消息推送","可选"],
          ["POST","/api/v1/kb/documents","上传知识库文档","必须 (Admin)"],
          ["GET","/api/v1/kb/documents","列出知识库文档","必须 (Admin)"],
          ["DELETE","/api/v1/kb/documents/{id}","删除知识库文档","必须 (Admin)"],
          ["GET","/api/v1/analytics/overview","获取运营数据看板","必须 (Admin)"],
          ["GET","/api/v1/tickets","获取工单列表","必须 (Agent/Admin)"],
          ["PUT","/api/v1/tickets/{id}","更新工单状态","必须 (Agent/Admin)"],
        ]
      ),
      blank(),

      h2("5.3 SSE 流式消息格式"),
      ...codeBlock([
        "  Content-Type: text/event-stream",
        "",
        "  // 文本流块",
        "  event: message_chunk",
        '  data: {"session_id": "xxx", "chunk": "您的订单", "index": 0}',
        "",
        "  // 工具调用",
        "  event: tool_call",
        '  data: {"tool": "query_order", "params": {"order_id": "ORD123"}}',
        "",
        "  // 工具结果（融入下一段回复）",
        "  event: tool_result",
        '  data: {"tool": "query_order", "result": "已到达上海集散中心"}',
        "",
        "  // 消息结束",
        "  event: message_done",
        '  data: {"total_tokens": 342, "finish_reason": "stop", "sources": [...]}',
        "",
        "  // 引用来源",
        "  event: sources",
        '  data: [{"doc_id": "kb-001", "title": "退款政策", "chunk": "...", "score": 0.92}]',
      ]),
      pageBreak(),

      // ── 6. 安全架构 ────────────────────────────────────────
      h1("6. 安全架构"),
      h2("6.1 纵深防御策略"),
      mkTable(
        ["层次","威胁","防御措施"],
        [1800, 2800, 4928],
        [
          ["网络层","DDoS / 爬虫","Kong 限流插件（IP/User/Global 三级），CloudFlare WAF"],
          ["认证层","Token 伪造","JWT RS256 非对称签名，Token 黑名单（Redis）"],
          ["输入层","Prompt 注入","输入正则过滤 + Claude 系统 Prompt 防注入指令"],
          ["模型层","有害内容","Claude Constitutional AI + 自定义拒绝话题列表"],
          ["数据层","横向越权","PostgreSQL Row-level Security，API 层 tenant_id 校验"],
          ["存储层","数据泄露","消息内容 AES-256 加密，Claude API Key 加密存储（KMS）"],
          ["传输层","中间人","TLS 1.3，HSTS 强制，证书 Pinning（移动端）"],
        ]
      ),
      blank(),

      h2("6.2 数据隐私合规"),
      bullet("支持用户对话数据导出（GDPR Article 20 数据可携带权）"),
      bullet("支持用户数据删除（GDPR Right to Erasure）"),
      bullet("中国用户数据存储于国内节点，遵循《个人信息保护法》"),
      bullet("操作审计日志留存 180 天，支持安全审计导出"),
      pageBreak(),

      // ── 7. 部署架构 ────────────────────────────────────────
      h1("7. 部署架构"),
      h2("7.1 Kubernetes 部署拓扑"),
      mkTable(
        ["服务","副本数（初期）","资源配置","HPA 策略"],
        [2500, 1800, 2500, 2726],
        [
          ["api-gateway (Kong)","2","2C/2G","CPU > 70% 扩容"],
          ["llm-proxy","3","4C/8G","CPU > 60% / 队列深度 > 100"],
          ["rag-engine","2","4C/8G","CPU > 70%"],
          ["session-service","2","2C/4G","CPU > 70%"],
          ["business-service","2","2C/4G","CPU > 70%"],
          ["worker (Celery)","3","2C/4G","队列积压 > 1000 扩容"],
          ["frontend (Nginx)","2","1C/1G","QPS > 500"],
        ]
      ),
      blank(),

      h2("7.2 CI/CD 流水线"),
      ...codeBlock([
        "  [Code Push] ──► [GitHub Actions]",
        "                       │",
        "           ┌───────────┼───────────┐",
        "           ▼           ▼           ▼",
        "       [Lint]     [Unit Test]  [Security Scan]",
        "           └───────────┼───────────┘",
        "                       │ 全部通过",
        "                       ▼",
        "               [Build Docker Image]",
        "                       │",
        "                       ▼",
        "               [Push to Registry]",
        "                       │",
        "                       ▼",
        "               [Deploy to Staging]",
        "                       │",
        "               [E2E Test (Playwright)]",
        "                       │ 通过",
        "                       ▼",
        "               [Canary 5% → 20% → 100%]",
        "                       │",
        "               [Production Release]",
      ]),
      blank(),

      h2("7.3 私有化部署方案"),
      body("面向对数据安全要求极高的客户（金融、政务），提供完整私有化部署包："),
      bullet("基础要求：Kubernetes 集群（推荐 3 Master + 5 Worker 节点）"),
      bullet("LLM 选项：Claude API（网络可达）或本地 DeepSeek-V3 部署（GPU 节点）"),
      bullet("交付物：Helm Charts + 部署脚本 + 运维手册"),
      bullet("离线镜像仓库支持：所有容器镜像可导入离线私有 Registry"),
      pageBreak(),

      // ── 8. 可观测性 ───────────────────────────────────────
      h1("8. 可观测性设计"),
      h2("8.1 三大支柱"),
      mkTable(
        ["支柱","工具","核心指标"],
        [1500, 2500, 5526],
        [
          ["Metrics（指标）","Prometheus + Grafana","LLM TTFT / 会话并发数 / KB 命中率 / Token 消耗"],
          ["Traces（追踪）","OpenTelemetry + Jaeger","端到端请求链路，LLM 调用耗时分布"],
          ["Logs（日志）","ELK Stack","结构化 JSON 日志，异常聚合告警"],
        ]
      ),
      blank(),
      h2("8.2 关键告警规则"),
      mkTable(
        ["告警","阈值","级别","通知"],
        [2500, 2000, 1000, 4026],
        [
          ["LLM TTFT > 3s（P95）","持续 5min","P1","钉钉/飞书 + 邮件"],
          ["Claude API 错误率 > 5%","持续 2min","P0","电话 + 短信"],
          ["会话队列积压 > 500","持续 3min","P1","钉钉/飞书"],
          ["Pod OOM / CrashLoopBackOff","即时","P0","电话 + 短信"],
          ["磁盘使用率 > 85%","即时","P2","邮件"],
        ]
      ),
      pageBreak(),

      // ── 9. 技术风险与对策 ─────────────────────────────────
      h1("9. 技术风险与应对策略"),
      mkTable(
        ["风险","概率","影响","应对措施"],
        [2500, 1000, 1000, 5026],
        [
          ["Claude API 限速/不可用","中","高","降级至 GPT-4o；本地 DeepSeek 作第二降级；请求队列重试"],
          ["LLM 幻觉（Hallucination）","高","中","强制 RAG 引用；低置信度触发人工转接；定期幻觉评测"],
          ["向量数据库性能瓶颈","低","高","Milvus 水平分片；索引预热；查询缓存"],
          ["多租户数据泄露","极低","高","PostgreSQL RLS；API 层 double check；定期渗透测试"],
          ["知识库更新延迟","低","中","异步索引 + 增量更新；变更通知 Webhook"],
        ]
      ),
      blank(),

      // ── 10. 变更记录 ──────────────────────────────────────
      h1("10. 变更记录"),
      mkTable(
        ["版本","日期","变更描述"],
        [1500, 2000, 6026],
        [["v1.0","2026-03-24","初版，定义五层架构、技术选型、API 规范、安全与部署方案"]]
      ),
      blank()
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("docs/02_技术架构设计文档.docx", buf);
  console.log("✅ 技术架构文档生成成功: docs/02_技术架构设计文档.docx");
});
