const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, TableOfContents, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

// ─── 颜色常量 ───────────────────────────────────────────────
const C_BLUE   = "1F4E79";
const C_LIGHT  = "D6E4F0";
const C_MID    = "2E75B6";
const C_GRAY   = "404040";
const C_WHITE  = "FFFFFF";
const C_YELLOW = "FFF2CC";
const C_GREEN  = "E2EFDA";

// ─── 复用边框 ────────────────────────────────────────────────
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

// ─── 工具函数 ────────────────────────────────────────────────
const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, bold: true, color: C_WHITE, size: 32 })],
  shading: { fill: C_BLUE, type: ShadingType.CLEAR },
  spacing: { before: 360, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C_MID } }
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, bold: true, color: C_MID, size: 28 })],
  spacing: { before: 300, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C_LIGHT } }
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, bold: true, color: C_GRAY, size: 24 })],
  spacing: { before: 200, after: 120 }
});

const body = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22, color: "333333" })],
  spacing: { after: 120 }
});

const bullet = (text, level = 0) => new Paragraph({
  numbering: { reference: "bullets", level },
  children: [new TextRun({ text, size: 22, color: "333333" })],
  spacing: { after: 80 }
});

const numbered = (text, level = 0) => new Paragraph({
  numbering: { reference: "numbers", level },
  children: [new TextRun({ text, size: 22, color: "333333" })],
  spacing: { after: 80 }
});

const bold = (text) => new TextRun({ text, bold: true, size: 22 });
const normal = (text) => new TextRun({ text, size: 22 });

const headerRow = (cols, widths) => new TableRow({
  tableHeader: true,
  children: cols.map((c, i) => new TableCell({
    borders: allBorders,
    width: { size: widths[i], type: WidthType.DXA },
    shading: { fill: C_BLUE, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, color: C_WHITE, size: 20 })] })]
  }))
});

const dataRow = (cols, widths, shade = "FFFFFF") => new TableRow({
  children: cols.map((c, i) => new TableCell({
    borders: allBorders,
    width: { size: widths[i], type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, color: "333333" })] })]
  }))
});

const makeTable = (cols, widths, rows) => new Table({
  width: { size: widths.reduce((a,b)=>a+b,0), type: WidthType.DXA },
  columnWidths: widths,
  rows: [headerRow(cols, widths), ...rows.map((r,i) => dataRow(r, widths, i%2===0?"F7FBFF":"FFFFFF"))]
});

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const blank = () => new Paragraph({ children: [new TextRun("")], spacing: { after: 80 } });

// ═══════════════════════════════════════════════════════════════
// 文档内容
// ═══════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
        ]
      },
      { reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
        ]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "智能云客服平台（ClawCS） — 产品需求文档（PRD）", size: 18, color: "888888" }),
            new TextRun({ text: "\t内部文件  v1.0", size: 18, color: "AAAAAA" })
          ],
          tabStops: [{ type: "right", position: 9026 }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } }
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "© 2026 ClawCS  ", size: 18, color: "999999" }),
            new TextRun({ text: "\t第 ", size: 18, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999" }),
            new TextRun({ text: " 页", size: 18, color: "999999" })
          ],
          tabStops: [{ type: "right", position: 9026 }],
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } }
        })]
      })
    },
    children: [

      // ── 封面 ──────────────────────────────────────────────
      blank(), blank(), blank(),
      new Paragraph({
        children: [new TextRun({ text: "智能云客服平台（ClawCS）", bold: true, size: 56, color: C_BLUE })],
        alignment: AlignmentType.CENTER, spacing: { after: 240 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "产品需求文档（PRD）", size: 36, color: C_MID })],
        alignment: AlignmentType.CENTER, spacing: { after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Product Requirements Document", size: 28, color: "888888", italics: true })],
        alignment: AlignmentType.CENTER, spacing: { after: 400 }
      }),
      makeTable(
        ["版本","状态","创建日期","最后更新"],
        [2256,2256,2257,2257],
        [["v1.0","草稿","2026-03-24","2026-03-24"]]
      ),
      blank(), blank(),
      new Paragraph({
        children: [new TextRun({ text: "本文档供内部研发及产品团队使用，未经授权请勿外传。", size: 20, color: "999999", italics: true })],
        alignment: AlignmentType.CENTER
      }),
      pageBreak(),

      // ── 目录 ──────────────────────────────────────────────
      new TableOfContents("目  录", { hyperlink: true, headingStyleRange: "1-3" }),
      pageBreak(),

      // ── 1. 文档概述 ────────────────────────────────────────
      h1("1. 文档概述"),
      h2("1.1 目的与范围"),
      body("本文档定义了「ClawCS 智能云客服平台」第一期产品的完整功能需求、用户故事、非功能性要求及验收标准，作为产品研发、测试和运营的唯一权威参考。"),
      body("范围涵盖：平台前端（用户侧对话界面）、管理后台、大模型接入层（以 Anthropic Claude API 为核心）、知识库管理系统、多渠道接入（Web / APP / 微信小程序）及数据分析模块。"),

      h2("1.2 定义与缩略语"),
      makeTable(
        ["术语/缩写","说明"],
        [2500, 7026],
        [
          ["LLM","大型语言模型（Large Language Model），本项目默认接入 Anthropic Claude"],
          ["RAG","检索增强生成（Retrieval-Augmented Generation），将外部知识注入 LLM 上下文"],
          ["PRD","产品需求文档（Product Requirements Document）"],
          ["API","应用程序接口（Application Programming Interface）"],
          ["SSE","服务器推送事件（Server-Sent Events），实现流式输出"],
          ["NLU","自然语言理解（Natural Language Understanding）"],
          ["KB","知识库（Knowledge Base）"],
          ["Agent","具备工具调用能力的 LLM 智能体"],
          ["CRM","客户关系管理系统（Customer Relationship Management）"],
          ["MVP","最小可行产品（Minimum Viable Product）"]
        ]
      ),
      blank(),

      h2("1.3 参考资料"),
      bullet("Anthropic Claude API 官方文档（platform.claude.com）"),
      bullet("IDC《全球人工智能支出指南》2025"),
      bullet("艾媒咨询《2025年中国智能客服市场发展报告》"),
      bullet("n1n.ai《从 0 到 MVP 两周实战：构建生产级 AI 智能客服系统》2026"),
      bullet("\u6c99\u4e18\u667a\u5e93\u300a2024\u5e74\u201c\u5927\u6a21\u578b+\u667a\u80fd\u5ba2\u670d\u201d\u6700\u4f73\u5b9e\u8df5\u62a5\u544a\u300b"),
      pageBreak(),

      // ── 2. 产品背景 ────────────────────────────────────────
      h1("2. 产品背景"),
      h2("2.1 市场机遇"),
      body("全球智能客服市场规模预计于 2027 年突破 380 亿美元，复合增长率超过 22%（IDC 数据）。大模型技术的崛起使得传统基于规则/意图分类的客服机器人产品能力天花板明显，企业对 LLM 驱动的新一代客服平台需求旺盛。"),
      body("当前市场主流产品（智齿、美洽、云问等）在多轮语义理解、复杂工单处理、知识库动态更新等方面仍有明显短板，以 Claude 为核心大模型具备以下差异化优势："),
      bullet("强上下文窗口（200K tokens），支持超长对话记忆"),
      bullet("Constitutional AI 安全框架，降低有害回复风险"),
      bullet("原生 Tool Use / Function Calling，便于接入 CRM/ERP 等系统"),
      bullet("Artifacts 能力可生成结构化文档（报价单、投诉单等）"),
      blank(),

      h2("2.2 用户痛点"),
      makeTable(
        ["角色","核心痛点"],
        [2000, 7526],
        [
          ["终端用户（C端）","等待时间长；人工客服态度不一；跨渠道信息不一致；解决问题需反复重复背景信息"],
          ["企业运营（B端）","知识库维护成本高；坐席效率低下；质检依赖人工；无法量化客服质量"],
          ["IT 团队","与自有系统集成复杂；LLM 对接需自行工程化；安全合规要求难以满足"],
          ["产品管理","缺乏数据看板，无法快速迭代 KB；无法 AB 测试不同话术"]
        ]
      ),
      blank(),

      h2("2.3 产品愿景"),
      new Paragraph({
        children: [new TextRun({
          text: "「让每一次客户对话，都成为价值积累。」",
          bold: true, size: 28, color: C_MID, italics: true
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 }
      }),
      body("ClawCS 以 Claude 大模型为核心引擎，融合 RAG 知识检索、多轮对话管理、全渠道接入与实时数据分析，打造「高准确 × 低幻觉 × 强合规」的企业级智能客服平台。"),
      pageBreak(),

      // ── 3. 目标用户与用户画像 ─────────────────────────────────
      h1("3. 目标用户与用户画像"),
      h2("3.1 用户角色概览"),
      makeTable(
        ["角色","描述","使用场景"],
        [2000, 4000, 3526],
        [
          ["访客/客户","企业终端客户，通过各渠道发起咨询","购前咨询、售后维权、账单查询等"],
          ["客服坐席","处理复杂/升级工单的人工坐席","AI 无法处理时，接管并借助 AI 辅助回复"],
          ["知识库管理员","维护产品知识库、FAQ、政策文档","上传/审核/更新知识文档，评估 KB 命中质量"],
          ["运营管理员","监控平台运营指标，配置业务规则","查看数据看板，调整话术策略，配置路由规则"],
          ["系统管理员","负责平台技术配置与安全","配置 LLM 参数、接入渠道、权限管理"]
        ]
      ),
      blank(),

      h2("3.2 典型用户画像"),
      h3("画像 A：电商企业客服主管 — 王梅"),
      bullet("年龄：32岁，某头部电商平台客服中心主管"),
      bullet("痛点：每日咨询量 5 万+，50% 是重复问题；坐席 100 人，人力成本高"),
      bullet("目标：用 AI 覆盖 80% 的售前/售后标准问题，坐席专注复杂工单"),
      bullet("技术素养：中等，不会写代码，需要可视化管理界面"),
      blank(),
      h3("画像 B：SaaS 企业 CTO — 李阳"),
      bullet("年龄：38岁，B2B SaaS 公司技术负责人"),
      bullet("痛点：客户技术支持依赖人工，响应慢；文档库庞大，员工难以检索"),
      bullet("目标：接入 ClawCS RAG 引擎，自动检索技术文档回答用户问题"),
      bullet("技术素养：高，关注 API 文档、SDK、私有化部署选项"),
      pageBreak(),

      // ── 4. 功能需求 ────────────────────────────────────────
      h1("4. 功能需求"),
      h2("4.1 功能模块总览"),
      makeTable(
        ["模块","优先级","版本"],
        [5000, 2000, 2526],
        [
          ["F1 — 多渠道对话接入（Web / APP / 小程序 / 企业微信）","P0","v1.0"],
          ["F2 — Claude LLM 对话引擎（流式输出 + 上下文管理）","P0","v1.0"],
          ["F3 — RAG 知识库问答","P0","v1.0"],
          ["F4 — 人工坐席转接与协作","P0","v1.0"],
          ["F5 — 知识库管理（上传/标注/审核/版本）","P0","v1.0"],
          ["F6 — 对话管理与历史记录","P0","v1.0"],
          ["F7 — 数据分析看板","P1","v1.0"],
          ["F8 — 工单系统","P1","v1.0"],
          ["F9 — 多语言支持","P1","v1.1"],
          ["F10 — 语音转文字（ASR）","P2","v2.0"],
          ["F11 — 多 Agent 协同（销售/售后/投诉专家）","P2","v2.0"]
        ]
      ),
      blank(),

      h2("4.2 F1 — 多渠道对话接入"),
      h3("4.2.1 需求描述"),
      body("平台需支持用户通过 Web 悬浮窗口、移动 APP SDK、微信小程序、企业微信、邮件等渠道与 AI 客服交互，对话历史在渠道间可追溯。"),
      h3("4.2.2 用户故事"),
      bullet("作为终端用户，我可以在公司官网右下角点击悬浮按钮打开对话窗，无需注册即可咨询"),
      bullet("作为终端用户，我在手机 APP 发起的对话，切换到 PC 网页后仍能查看完整历史"),
      bullet("作为终端用户，我可以通过微信小程序直接与 AI 客服对话，无需跳转其他平台"),
      h3("4.2.3 验收标准"),
      numbered("Web 组件在 Chrome/Firefox/Safari/Edge 最新版正常渲染，首屏加载 ≤ 2s"),
      numbered("微信小程序通过官方审核，首包体积 ≤ 2MB"),
      numbered("跨渠道消息同步延迟 ≤ 5s"),
      blank(),

      h2("4.3 F2 — Claude LLM 对话引擎"),
      h3("4.3.1 需求描述"),
      body("集成 Anthropic Claude API（支持 claude-3-5-sonnet / claude-3-7-sonnet 等模型），支持 SSE 流式输出，上下文窗口管理不少于最近 20 轮对话，系统 Prompt 支持租户级自定义。"),
      h3("4.3.2 关键参数配置项"),
      makeTable(
        ["配置项","默认值","说明"],
        [2800, 2000, 4726],
        [
          ["model","claude-3-5-sonnet-20241022","可按租户切换"],
          ["max_tokens","2048","最大生成 Token 数"],
          ["temperature","0.3","控制回复稳定性（客服场景低温度更稳定）"],
          ["system_prompt","[租户自定义]","定义 AI 角色、回答规范、禁止话题"],
          ["context_window","20 轮","上下文保留轮次，超出按摘要压缩"],
          ["stream","true","默认开启流式输出"],
          ["tool_use","true","启用工具调用（查询订单/工单等）"]
        ]
      ),
      blank(),
      h3("4.3.3 验收标准"),
      numbered("首 Token 响应时间（TTFT）在正常网络环境 ≤ 1.5s"),
      numbered("完整回复平均延迟 ≤ 3s（500 Token 内）"),
      numbered("流式输出无乱码、无中断"),
      numbered("系统 Prompt 修改后 ≤ 60s 生效（无需重启服务）"),
      blank(),

      h2("4.4 F3 — RAG 知识库问答"),
      h3("4.4.1 需求描述"),
      body("基于向量数据库（推荐 Milvus / Chroma）实现企业私有知识库检索，用户问题经 Embedding 后语义检索最相关文档片段，注入 Claude Context 生成有依据的回答，并标注引用来源。"),
      h3("4.4.2 支持知识源格式"),
      bullet("文档：PDF、DOCX、PPTX、TXT、Markdown"),
      bullet("网页：URL 爬取（支持定期自动更新）"),
      bullet("结构化数据：CSV / Excel / 数据库表（通过 API 同步）"),
      bullet("富媒体：支持图片 OCR 提取文本（v1.1 迭代）"),
      h3("4.4.3 验收标准"),
      numbered("知识库命中率（Recall@3）≥ 85%（标准评测集）"),
      numbered("基于知识库回答的引用标注准确率 ≥ 95%"),
      numbered("知识库更新后索引重建 ≤ 5 分钟（10,000 文档以内）"),
      blank(),

      h2("4.5 F4 — 人工坐席转接与 AI 辅助"),
      h3("4.5.1 需求描述"),
      body("当用户情绪激烈、问题超出 AI 能力范围、或用户主动要求时，系统自动/手动将对话转接给在线人工坐席。坐席界面提供 AI 辅助建议（推荐回复、知识库检索）。"),
      h3("4.5.2 转接触发条件"),
      bullet("AI 连续 2 次回答用户表示不满（情绪识别）"),
      bullet("AI 置信度低于阈值（默认 0.6）"),
      bullet("\u5de5\u5355\u7c7b\u578b\u88ab\u6807\u8bb0\u4e3a\u300c\u6295\u8bc9\u300d\u6216\u300c\u9000\u6b3e\u300d"),
      bullet("\u7528\u6237\u660e\u786e\u8f93\u5165\u300c\u4eba\u5de5\u300d\u3001\u300c\u8f6c\u4eba\u5de5\u300d\u7b49\u5173\u952e\u8bcd"),
      h3("4.5.3 验收标准"),
      numbered("转接请求响应 ≤ 30s（在线坐席不为零时）"),
      numbered("AI 辅助建议准确率用户评分 ≥ 4.0/5.0"),
      pageBreak(),

      h2("4.6 F5 — 知识库管理"),
      body("管理员可通过可视化界面完成知识文档的生命周期管理：上传、分类标签、版本控制、质量审核、启用/停用，并可查看每份文档的命中频次与评分。"),
      h2("4.7 F7 — 数据分析看板"),
      body("提供实时与历史数据看板，核心指标如下："),
      makeTable(
        ["指标","说明","更新频率"],
        [2500, 4500, 2526],
        [
          ["会话量","总会话数 / AI 独立处理率 / 转人工率","实时"],
          ["首次解决率（FCR）","用户单次对话解决问题的比率","实时"],
          ["满意度（CSAT）","用户对话结束后评星分布","实时"],
          ["平均处理时长（AHT）","从开始到结束平均时长","实时"],
          ["KB 命中率","知识库检索命中占比","每小时"],
          ["LLM Token 消耗","按租户/模型统计用量与费用","每日"]
        ]
      ),
      pageBreak(),

      // ── 5. 非功能性需求 ────────────────────────────────────
      h1("5. 非功能性需求"),
      h2("5.1 性能需求"),
      makeTable(
        ["指标","目标值","备注"],
        [3500, 2500, 3526],
        [
          ["并发会话数","≥ 1,000","单节点；水平扩展后 ≥ 10,000"],
          ["API 接口响应时间（P95）","≤ 500ms","非 LLM 接口"],
          ["系统可用性（SLA）","≥ 99.9%","月度统计（宕机 ≤ 44 分钟/月）"],
          ["LLM 首 Token 响应（TTFT）","≤ 1.5s","通过 SSE 流式输出"],
          ["知识库检索延迟（P95）","≤ 200ms","向量数据库召回"],
          ["数据看板刷新延迟","≤ 5s","Websocket 推送"]
        ]
      ),
      blank(),

      h2("5.2 安全与合规"),
      bullet("用户对话内容端到端加密（TLS 1.3），静态数据 AES-256 加密"),
      bullet("支持私有化部署（本地 + 私有云），满足数据不出域要求"),
      bullet("遵循 GDPR（欧洲用户）及《个人信息保护法》（中国用户）"),
      bullet("Prompt 注入防护：输入过滤 + Claude Constitutional AI 双重防线"),
      bullet("租户数据严格隔离，Row-level Security 保证多租户安全"),
      bullet("操作日志完整留存 180 天，支持审计"),
      blank(),

      h2("5.3 可扩展性"),
      bullet("微服务架构，核心服务（LLM Proxy / KB / Session / Analytics）独立水平扩展"),
      bullet("LLM 层抽象化设计，支持切换 OpenAI / Claude / 本地开源模型（如 DeepSeek）"),
      bullet("Webhook / OpenAPI 对外开放，支持与第三方 CRM / ERP / 工单系统集成"),
      blank(),

      h2("5.4 可用性与运维"),
      bullet("支持蓝绿部署与金丝雀发布，降低变更风险"),
      bullet("分布式链路追踪（OpenTelemetry），快速定位 LLM 调用异常"),
      bullet("语义缓存（Redis Semantic Cache）降低 LLM 重复调用 ≥ 60%"),
      bullet("自动扩缩容（Kubernetes HPA），应对流量峰值"),
      pageBreak(),

      // ── 6. 用户旅程地图 ────────────────────────────────────
      h1("6. 用户旅程地图"),
      h2("6.1 C 端用户 — 售后咨询旅程"),
      makeTable(
        ["阶段","用户行为","系统响应","用户情绪"],
        [1800, 3200, 3200, 2326],
        [
          ["触达","点击官网悬浮客服按钮","打开对话窗，展示欢迎语 + 常见问题快捷选项","期待"],
          ["咨询","输入「我的订单在哪？」","RAG 检索物流查询工具，返回实时物流状态","满意"],
          ["深入","「什么时候能到？」","结合上下文给出预计到达时间，主动问是否还有其他问题","放松"],
          ["升级","「我要投诉，这已经延误 3 天了！」","情绪识别触发，提示转人工；坐席 < 30s 接单","焦虑→缓解"],
          ["解决","坐席致歉并处理补偿","AI 生成工单草稿，坐席一键确认","满意"],
          ["反馈","对话结束后弹出评分","收集 CSAT 评分，异步存储","愉快"]
        ]
      ),
      pageBreak(),

      // ── 7. 约束与假设 ─────────────────────────────────────
      h1("7. 约束与假设"),
      h2("7.1 技术约束"),
      bullet("Claude API 调用受 Anthropic 速率限制（初始 Tier：60 RPM），需实现请求队列与重试机制"),
      bullet("LLM 上下文窗口有限，超长对话需采用摘要压缩策略"),
      bullet("向量数据库选型需支持百万级向量检索，初期推荐 Chroma（轻量）或 Milvus（生产）"),
      blank(),
      h2("7.2 业务假设"),
      bullet("初期目标客户为中型企业（坐席 10-200 人）"),
      bullet("假设 Claude API 可稳定商用，不存在封禁风险；后备方案为 OpenAI GPT-4o"),
      bullet("v1.0 不包含语音通话（电话客服）场景"),
      pageBreak(),

      // ── 8. 里程碑与发布计划 ─────────────────────────────────
      h1("8. 里程碑与发布计划"),
      makeTable(
        ["阶段","目标","关键交付物","时间"],
        [1400, 3000, 3500, 1626],
        [
          ["M0","需求冻结 & 技术方案","PRD v1.0 / 技术架构文档 / 接口设计","W1-W2"],
          ["M1","核心引擎 MVP","LLM 对话 + 基础 RAG + Web 对话框","W3-W6"],
          ["M2","完整 Alpha","多渠道接入 + 知识库管理 + 人工转接","W7-W10"],
          ["M3","Beta 内测","数据看板 + 工单系统 + 性能调优","W11-W14"],
          ["M4","正式上线 v1.0","安全加固 + 私有化部署方案 + 运维体系","W15-W16"]
        ]
      ),
      blank(),

      // ── 9. 待定事项 ────────────────────────────────────────
      h1("9. 待定事项（Open Questions）"),
      makeTable(
        ["编号","问题","负责人","截止时间"],
        [1000, 4500, 2000, 2026],
        [
          ["OQ-01","是否支持自建私有 LLM（如 DeepSeek）作为 Claude 的降级方案？","CTO","W2"],
          ["OQ-02","多租户价格模型：按 Token 计费 or 按坐席席位？","CPO","W2"],
          ["OQ-03","微信小程序客服接口是否满足知识库注入要求？","技术架构师","W3"],
          ["OQ-04","GDPR 数据驻留方案：中国用户数据是否需要单独集群？","法务 & CTO","W4"]
        ]
      ),
      blank(),

      // ── 10. 文档变更记录 ──────────────────────────────────
      h1("10. 变更记录"),
      makeTable(
        ["版本","日期","作者","变更说明"],
        [1000, 2000, 2000, 4526],
        [["v1.0","2026-03-24","产品团队","初版创建，基于市场调研与技术可行性评估"]]
      ),
      blank()
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("docs/01_PRD_产品需求文档.docx", buf);
  console.log("✅ PRD 生成成功: docs/01_PRD_产品需求文档.docx");
});
