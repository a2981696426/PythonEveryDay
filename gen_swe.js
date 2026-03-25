const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

const C_BLUE = "003366"; const C_MID = "0070C0"; const C_LIGHT = "BDD7EE";
const C_WHITE = "FFFFFF"; const C_GRAY = "333333";

const thin = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const allB = { top: thin, bottom: thin, left: thin, right: thin };

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: t, bold: true, color: C_WHITE, size: 28 })],
  shading: { fill: C_BLUE, type: ShadingType.CLEAR },
  spacing: { before: 360, after: 180 } });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text: t, bold: true, color: C_MID, size: 26 })],
  spacing: { before: 260, after: 130 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C_LIGHT } } });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text: t, bold: true, color: "444444", size: 24 })],
  spacing: { before: 180, after: 100 } });
const body = (t) => new Paragraph({ children: [new TextRun({ text: t, size: 22, color: C_GRAY })], spacing: { after: 100 } });
const bullet = (t, lv=0) => new Paragraph({ numbering: { reference: "bul", level: lv },
  children: [new TextRun({ text: t, size: 22, color: C_GRAY })], spacing: { after: 60 } });
const blank = () => new Paragraph({ children: [new TextRun("")], spacing: { after: 80 } });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const code = (t) => new Paragraph({
  children: [new TextRun({ text: t, font: "Courier New", size: 18, color: "1A1A1A" })],
  shading: { fill: "F2F4F6", type: ShadingType.CLEAR },
  spacing: { after: 20 }, indent: { left: 360 }
});

const mkTable = (cols, widths, rows) => {
  const total = widths.reduce((a,b)=>a+b,0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: cols.map((c,i) => new TableCell({
        borders: allB, width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: C_BLUE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, color: C_WHITE, size: 20 })] })]
      })) }),
      ...rows.map((r,ri) => new TableRow({ children: r.map((c,i) => new TableCell({
        borders: allB, width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: ri%2===0?"EBF4FB":"FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, color: C_GRAY })] })]
      })) }))
    ]
  });
};

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
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 260, after: 130 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 },
      margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
    headers: { default: new Header({ children: [new Paragraph({
      children: [new TextRun({ text: "ClawCS \u2014 \u8f6f\u4ef6\u5de5\u7a0b\u89c4\u8303\u6587\u6863\u96c6 v1.0", size: 18, color: "999999" })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } }
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      children: [new TextRun({ text: "\u00a9 2026 ClawCS\t", size: 18, color: "AAAAAA" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "AAAAAA" }),
                new TextRun({ text: " / ", size: 18, color: "AAAAAA" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "AAAAAA" })],
      tabStops: [{ type: "right", position: 9026 }],
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } }
    })] }) },
    children: [

      // ── 封面 ──────────────────────────────────────────────
      blank(), blank(), blank(),
      new Paragraph({ children: [new TextRun({ text: "ClawCS \u667a\u80fd\u4e91\u5ba2\u670d\u5e73\u53f0", bold: true, size: 52, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { after: 180 } }),
      new Paragraph({ children: [new TextRun({ text: "\u8f6f\u4ef6\u5de5\u7a0b\u89c4\u8303\u6587\u6863\u96c6", size: 38, color: C_MID })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: "Software Engineering Standards & Specifications", size: 24, color: "888888", italics: true })],
        alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      new Paragraph({ children: [new TextRun({ text: "\u5305\u542b\uff1a\u5f00\u53d1\u89c4\u8303 | \u63a5\u53e3\u8bbe\u8ba1\u89c4\u8303 | \u6570\u636e\u5e93\u8bbe\u8ba1 | \u6d4b\u8bd5\u89c4\u8303 | Git \u5de5\u4f5c\u6d41", size: 22, color: "666666" })],
        alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
      mkTable(["版本","状态","创建日期","维护人"],[2256,2256,2256,2758],[["v1.0","生效","2026-03-24","研发效能组"]]),
      pageBreak(),

      // ═══════════════════════════════════════════════════
      // PART A — 开发规范
      // ═══════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun({ text: "PART A  \u5f00\u53d1\u89c4\u8303", bold: true, size: 36, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 } }),

      h1("A1. 代码规范"),
      h2("A1.1 通用规则"),
      bullet("所有代码使用英文命名（注释可用中文），禁止拼音变量名"),
      bullet("行宽限制：Python 120 字符，TypeScript/JS 100 字符"),
      bullet("文件末尾保留一个空行"),
      bullet("禁止提交包含 print/console.log 调试语句的代码到主干"),
      bullet("Magic Number 必须定义为具名常量"),
      blank(),

      h2("A1.2 Python 后端规范"),
      bullet("遵循 PEP 8，使用 Black 格式化，isort 管理 import 顺序"),
      bullet("类型注解：所有函数参数和返回值必须添加类型注解（Python 3.10+）"),
      bullet("Async/Await：I/O 密集型操作一律使用异步，禁止在异步函数中调用同步阻塞操作"),
      bullet("异常处理：捕获具体异常类型，禁止 except Exception as e: pass"),
      bullet("配置管理：使用 Pydantic Settings，禁止硬编码配置项"),
      blank(),
      ...["# ✅ 正确示例", "async def get_session(session_id: str, tenant_id: str) -> Session:", "    try:", "        session = await session_repo.get(session_id, tenant_id)", "        if not session:", "            raise SessionNotFoundError(session_id)", "        return session", "    except DatabaseError as e:", "        logger.error('DB error fetching session', extra={'session_id': session_id})", "        raise"].map(code),
      blank(),

      h2("A1.3 TypeScript 前端规范"),
      bullet("禁止使用 any 类型，优先使用 unknown + 类型守卫"),
      bullet("组件文件命名 PascalCase，工具函数 camelCase，常量 UPPER_SNAKE_CASE"),
      bullet("SSE 连接必须在组件 unmount 时关闭，防止内存泄漏"),
      bullet("API 请求统一走 axios instance（含 token 拦截器），禁止直接调用 fetch"),
      blank(),

      h2("A1.4 SQL 规范"),
      bullet("所有查询必须带 tenant_id 过滤，防止跨租户数据泄露"),
      bullet("禁止 SELECT *，明确列出所需字段"),
      bullet("索引原则：外键字段、高频查询字段必须建索引；复合查询遵循最左前缀"),
      bullet("大批量操作（> 1000 行）使用分批处理，避免长事务"),
      bullet("软删除：业务数据使用 deleted_at 字段，禁止物理 DELETE"),
      pageBreak(),

      // A2 — Git 工作流
      h1("A2. Git 工作流规范"),
      h2("A2.1 分支策略（GitFlow）"),
      mkTable(
        ["分支","用途","合并规则"],
        [2000, 3500, 4026],
        [
          ["main","生产发布分支","只接受 release/* 和 hotfix/* 的 PR"],
          ["develop","集成开发分支","feature/* 分支通过 PR 合并到此"],
          ["feature/{ticket-id}-{desc}","新功能开发","从 develop 创建，完成后 PR 回 develop"],
          ["fix/{ticket-id}-{desc}","Bug 修复","从 develop 创建，完成后 PR 回 develop"],
          ["release/{version}","版本发布准备","从 develop 创建，测试通过后合并 main + develop"],
          ["hotfix/{ticket-id}","生产紧急修复","从 main 创建，修复后同时合并 main + develop"],
        ]
      ),
      blank(),

      h2("A2.2 Commit Message 规范（Conventional Commits）"),
      ...["格式：<type>(<scope>): <subject>","","type 枚举：","  feat     - 新功能","  fix      - Bug 修复","  docs     - 文档变更","  style    - 代码格式（不影响功能）","  refactor - 重构","  test     - 测试","  chore    - 构建/工具链变更","","示例：","  feat(llm): add semantic cache with Redis vector search","  fix(rag): fix chunk overlap causing duplicate context","  docs(api): update SSE response format specification"].map(code),
      blank(),

      h2("A2.3 Code Review 标准"),
      bullet("PR 大小：单次 PR 变更不超过 500 行（不含测试），超出需拆分"),
      bullet("Reviewer 数量：至少 1 名 Reviewer 审批，核心模块（LLM/RAG/Auth）至少 2 名"),
      bullet("Review Checklist："),
      bullet("功能正确性 & 边界条件处理", 1),
      bullet("安全：是否有 SQL 注入 / Prompt 注入风险", 1),
      bullet("性能：N+1 查询、同步阻塞调用", 1),
      bullet("测试覆盖率（新代码 ≥ 80%）", 1),
      bullet("日志与可观测性", 1),
      pageBreak(),

      // A3 — 测试规范
      h1("A3. 测试规范"),
      h2("A3.1 测试分层"),
      mkTable(
        ["层级","范围","工具","覆盖率目标","执行时机"],
        [1400, 2500, 2000, 1500, 2126],
        [
          ["单元测试","函数/方法","pytest + pytest-asyncio","≥ 80%","每次 commit"],
          ["集成测试","服务间交互","pytest + TestContainers","≥ 60%","PR 阶段"],
          ["E2E 测试","完整用户流程","Playwright","核心路径 100%","发布前"],
          ["性能测试","并发 / 负载","Locust","达到 NFR 指标","发布前"],
          ["LLM 评测","回答质量","Ragas 框架","RAGAS Score ≥ 0.8","每周"],
        ]
      ),
      blank(),

      h2("A3.2 LLM 质量评测指标（Ragas）"),
      mkTable(
        ["指标","说明","目标值"],
        [2500, 4000, 3026],
        [
          ["Faithfulness（忠实性）","回答是否完全基于知识库内容，无幻觉","≥ 0.85"],
          ["Answer Relevancy（相关性）","回答与问题的相关程度","≥ 0.80"],
          ["Context Precision（上下文精确度）","召回的上下文是否都有用","≥ 0.75"],
          ["Context Recall（上下文召回率）","有用上下文是否都被召回","≥ 0.80"],
        ]
      ),
      pageBreak(),

      // ═══════════════════════════════════════════════════
      // PART B — 接口设计规范
      // ═══════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun({ text: "PART B  \u63a5\u53e3\u8bbe\u8ba1\u89c4\u8303", bold: true, size: 36, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 } }),

      h1("B1. RESTful API 设计规范"),
      h2("B1.1 URL 命名规则"),
      bullet("资源名使用复数小写名词：/sessions, /messages, /documents"),
      bullet("嵌套资源使用路径参数：/sessions/{id}/messages"),
      bullet("动作用 HTTP 方法表达，不在 URL 中出现动词（upload 除外）"),
      bullet("过滤/排序/分页通过 Query String：?page=1&size=20&sort=-created_at"),
      blank(),
      mkTable(
        ["操作","HTTP 方法","路径示例","说明"],
        [1800, 1400, 3500, 2826],
        [
          ["列表查询","GET","/api/v1/sessions","支持过滤、分页、排序"],
          ["单个查询","GET","/api/v1/sessions/{id}","返回完整资源"],
          ["创建","POST","/api/v1/sessions","返回 201 Created + Location"],
          ["全量更新","PUT","/api/v1/sessions/{id}","幂等操作"],
          ["部分更新","PATCH","/api/v1/sessions/{id}","只更新传入字段"],
          ["删除","DELETE","/api/v1/sessions/{id}","返回 204 No Content"],
        ]
      ),
      blank(),

      h2("B1.2 统一响应格式"),
      ...['// 成功响应','{',' "code": 0,',' "message": "success",',' "data": { ... },',' "request_id": "req_abc123",',' "timestamp": 1711234567890','}',"","// 失败响应",'{', ' "code": 40001,', ' "message": "\u4f1a\u8bdd\u4e0d\u5b58\u5728",',' "data": null,',' "request_id": "req_xyz789"',' "timestamp": 1711234567890','}'].map(code),
      blank(),

      h2("B1.3 错误码设计"),
      mkTable(
        ["HTTP 状态码","业务 code 前缀","说明"],
        [2000, 2000, 5526],
        [
          ["400 Bad Request","400xx","请求参数错误，40001-参数缺失，40002-格式错误"],
          ["401 Unauthorized","401xx","认证失败，40101-Token 失效，40102-Token 缺失"],
          ["403 Forbidden","403xx","无权限，40301-租户越权，40302-角色不足"],
          ["404 Not Found","404xx","资源不存在"],
          ["429 Too Many Requests","429xx","限流，42901-用户级，42902-全局级"],
          ["500 Internal Server Error","500xx","服务内部错误，50001-LLM 调用失败，50002-DB 异常"],
        ]
      ),
      pageBreak(),

      h1("B2. SSE 流式接口规范"),
      h2("B2.1 连接建立"),
      bullet("客户端发送 POST /sessions/{id}/messages，携带消息体，Content-Type: application/json"),
      bullet("服务端响应 200 OK，Content-Type: text/event-stream，Transfer-Encoding: chunked"),
      bullet("心跳：每 15 秒发送 event: ping，防止连接超时"),
      blank(),

      h2("B2.2 事件类型定义"),
      mkTable(
        ["Event 名","触发时机","data 字段"],
        [2500, 3000, 4026],
        [
          ["message_chunk","模型生成文本流","{ chunk: string, index: number }"],
          ["tool_call","模型调用工具","{ tool: string, params: object }"],
          ["tool_result","工具调用返回","{ tool: string, result: any, success: bool }"],
          ["sources","知识库引用来源","[{ doc_id, title, chunk, score }]"],
          ["message_done","消息生成完毕","{ total_tokens, finish_reason, message_id }"],
          ["error","发生错误","{ code: number, message: string }"],
          ["transfer","触发转人工","{ reason: string, queue_position: number }"],
          ["ping","心跳","{ ts: number }"],
        ]
      ),
      pageBreak(),

      h1("B3. Webhook 规范"),
      h2("B3.1 事件类型"),
      bullet("session.created — 新会话创建"),
      bullet("session.resolved — 会话已解决"),
      bullet("session.transferred — 转接人工"),
      bullet("ticket.created — 工单创建"),
      bullet("ticket.updated — 工单状态变更"),
      bullet("kb.index_completed — 知识库索引完成"),
      blank(),

      h2("B3.2 安全签名"),
      ...["// HTTP Header 包含签名","X-ClawCS-Signature: sha256=<HMAC-SHA256(secret, body)>","X-ClawCS-Timestamp: 1711234567","","// 接收方验证伪代码","expected = hmac_sha256(secret=webhook_secret, message=raw_body)","if not constant_time_compare(expected, received_signature):","    return 401","if abs(now() - timestamp) > 300:  # 5分钟时间戳容忍","    return 401"].map(code),
      pageBreak(),

      // ═══════════════════════════════════════════════════
      // PART C — 数据库设计规范
      // ═══════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun({ text: "PART C  \u6570\u636e\u5e93\u8bbe\u8ba1\u89c4\u8303", bold: true, size: 36, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 } }),

      h1("C1. PostgreSQL 表设计规范"),
      h2("C1.1 通用字段规则"),
      bullet("每张表必须包含：id (UUID), created_at, updated_at, deleted_at（软删除）"),
      bullet("多租户表必须包含：tenant_id (UUID NOT NULL)，并建立索引"),
      bullet("字段命名：snake_case，布尔字段以 is_/has_ 前缀"),
      bullet("字符串长度：明确指定 VARCHAR(N)，禁止无限制 TEXT（有长度限制的场景）"),
      blank(),

      h2("C1.2 核心表 DDL 示例"),
      ...["-- 会话表","CREATE TABLE sessions (","    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,","    tenant_id   UUID NOT NULL REFERENCES tenants(id),","    user_id     UUID REFERENCES users(id),","    channel     VARCHAR(32) NOT NULL,  -- web/app/wechat/email","    status      VARCHAR(32) NOT NULL DEFAULT 'ai_active',","    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),","    ended_at    TIMESTAMPTZ,","    metadata    JSONB,","    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),","    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),","    deleted_at  TIMESTAMPTZ","  );","","  CREATE INDEX idx_sessions_tenant_status ON sessions(tenant_id, status);","  CREATE INDEX idx_sessions_tenant_created ON sessions(tenant_id, created_at DESC);","","  -- 启用行级安全","  ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;","  CREATE POLICY tenant_isolation ON sessions","      USING (tenant_id = current_setting('app.tenant_id')::UUID);"].map(code),
      blank(),

      h2("C1.3 完整表清单"),
      mkTable(
        ["表名","关键字段（除通用字段外）","说明"],
        [2200, 4500, 2826],
        [
          ["tenants","name, slug, plan, settings(JSONB), llm_config(JSONB, enc)","租户配置"],
          ["users","tenant_id, email, role, password_hash, last_login_at","用户账户"],
          ["sessions","tenant_id, user_id, channel, status, metadata(JSONB)","对话会话"],
          ["messages","session_id, role(user/assistant/system/tool), content(TEXT, enc), tokens, model","消息记录"],
          ["knowledge_docs","tenant_id, title, source_type, file_path, status, chunk_count, embedding_model","KB 文档元数据"],
          ["kb_chunks","doc_id, chunk_index, content, token_count, milvus_id","文档分块记录"],
          ["agent_configs","tenant_id, name, system_prompt(TEXT), tools(JSONB), llm_params(JSONB)","AI 配置"],
          ["tickets","session_id, tenant_id, type, priority, status, assignee_id, resolved_at","工单"],
          ["agents","tenant_id, user_id, status(online/offline/busy), skills(JSONB)","人工坐席"],
          ["llm_usage","tenant_id, session_id, model, prompt_tokens, completion_tokens, cost_usd","LLM 用量计量"],
          ["audit_logs","tenant_id, user_id, action, resource_type, resource_id, ip, metadata(JSONB)","操作审计日志"],
        ]
      ),
      pageBreak(),

      h1("C2. 数据迁移规范"),
      h2("C2.1 迁移工具与规则"),
      bullet("使用 Alembic 管理数据库迁移，迁移文件版本化提交到 Git"),
      bullet("迁移文件命名：{版本号}_{描述}.py，如 0001_create_sessions_table.py"),
      bullet("每个迁移文件必须实现 upgrade() 和 downgrade()（支持回滚）"),
      bullet("禁止在迁移文件中包含数据业务逻辑（仅结构变更）"),
      bullet("生产环境迁移必须在业务低峰期执行，大表加字段使用 NOT NULL DEFAULT 策略"),
      blank(),

      h2("C2.2 数据变更审查"),
      mkTable(
        ["变更类型","风险","执行方式"],
        [2500, 2000, 5026],
        [
          ["新增表/字段","低","直接执行迁移"],
          ["修改字段类型","中","先新增字段，迁移数据，再删除旧字段（三步法）"],
          ["删除字段/表","高","先标记废弃（deprecated 注释），保留 2 个版本后删除"],
          ["添加索引（百万级表）","中","使用 CREATE INDEX CONCURRENTLY，不锁表"],
          ["大表数据迁移","高","分批处理（每批 5000 行），配合消息队列异步执行"],
        ]
      ),
      pageBreak(),

      // ═══════════════════════════════════════════════════
      // PART D — 项目计划
      // ═══════════════════════════════════════════════════
      new Paragraph({ children: [new TextRun({ text: "PART D  \u9879\u76ee\u8ba1\u5212\u4e0e\u91cc\u7a0b\u7891", bold: true, size: 36, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 } }),

      h1("D1. 项目里程碑总览"),
      mkTable(
        ["里程碑","阶段目标","主要交付物","计划完成","负责人"],
        [800, 2500, 3000, 1200, 2026],
        [
          ["M0","需求冻结 & 架构设计","PRD v1.0 / 技术架构文档 / 接口设计","W1-W2","产品+架构师"],
          ["M1","LLM 核心引擎 MVP","Claude 对话 + 基础 RAG + Web 对话框 Demo","W3-W6","后端 + 前端"],
          ["M2","Alpha 版本","多渠道接入 + KB 管理 + 人工转接","W7-W10","全团队"],
          ["M3","Beta 内测","数据看板 + 工单系统 + 性能压测","W11-W14","全团队+测试"],
          ["M4","正式发布 v1.0","安全加固 + 私有化方案 + 运维体系","W15-W16","全团队"],
        ]
      ),
      blank(),

      h1("D2. 团队职责矩阵（RACI）"),
      mkTable(
        ["任务","产品经理","架构师","后端","前端","测试","DevOps"],
        [2200, 1300, 1300, 1200, 1200, 1200, 1126],
        [
          ["需求分析","R/A","C","I","I","I","I"],
          ["架构设计","C","R/A","C","C","I","C"],
          ["LLM 引擎开发","I","C","R/A","I","C","I"],
          ["RAG 引擎开发","I","C","R/A","I","C","I"],
          ["前端 UI 开发","C","I","C","R/A","C","I"],
          ["API 对接联调","I","I","R","R","C","I"],
          ["测试（单元/集成/E2E）","I","I","C","C","R/A","I"],
          ["K8s 部署 & CI/CD","I","C","I","I","I","R/A"],
          ["上线审批","A","C","I","I","I","R"],
        ]
      ),
      new Paragraph({ children: [new TextRun({ text: "R=负责执行, A=审批决策, C=咨询/协作, I=知会", size: 18, color: "888888", italics: true })],
        spacing: { before: 60, after: 200 } }),
      blank(),

      h1("D3. 研发效能约定"),
      mkTable(
        ["指标","目标"],
        [4000, 5526],
        [
          ["Sprint 周期","2 周一个 Sprint，每周五 Sprint Review"],
          ["Bug 响应 SLA","P0 (生产崩溃): 1h 内响应；P1: 24h；P2: 下个 Sprint"],
          ["PR 合并等待","工作日 24h 内完成 Review，紧急 PR 4h"],
          ["文档更新","代码变更同步更新接口文档，严禁文档滞后"],
          ["值班机制","研发值班表，每周轮换，生产告警 5min 内响应"],
        ]
      ),
      blank(),

      // ── 变更记录 ──────────────────────────────────────
      h1("变更记录"),
      mkTable(
        ["版本","日期","变更内容"],
        [1500, 2000, 6026],
        [["v1.0","2026-03-24","初版，包含开发规范/接口规范/数据库规范/项目计划四个部分"]]
      ),
      blank()
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("docs/03_软件工程规范文档集.docx", buf);
  console.log("\u2705 \u8f6f\u4ef6\u5de5\u7a0b\u89c4\u8303\u6587\u6863\u96c6\u751f\u6210\u6210\u529f: docs/03_\u8f6f\u4ef6\u5de5\u7a0b\u89c4\u8303\u6587\u6863\u96c6.docx");
});
