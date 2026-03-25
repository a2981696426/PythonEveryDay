const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

const C_BLUE="1A4B8C",C_MID="2E75B6",C_LIGHT="D6E4F0",C_WHITE="FFFFFF",C_GRAY="333333",C_TEAL="00695C";
const thin={style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},allB={top:thin,bottom:thin,left:thin,right:thin};
const h1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:t,bold:true,color:C_WHITE,size:28})],shading:{fill:C_BLUE,type:ShadingType.CLEAR},spacing:{before:360,after:180}});
const h2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun({text:t,bold:true,color:C_MID,size:26})],spacing:{before:240,after:120},border:{bottom:{style:BorderStyle.SINGLE,size:2,color:C_LIGHT}}});
const h3=(t)=>new Paragraph({heading:HeadingLevel.HEADING_3,children:[new TextRun({text:t,bold:true,color:C_TEAL,size:24})],spacing:{before:160,after:80}});
const body=(t)=>new Paragraph({children:[new TextRun({text:t,size:22,color:C_GRAY})],spacing:{after:100}});
const bullet=(t,lv=0)=>new Paragraph({numbering:{reference:"bul",level:lv},children:[new TextRun({text:t,size:22,color:C_GRAY})],spacing:{after:60}});
const blank=()=>new Paragraph({children:[new TextRun("")],spacing:{after:80}});
const pageBreak=()=>new Paragraph({children:[new PageBreak()]});
const code=(t)=>new Paragraph({children:[new TextRun({text:t,font:"Courier New",size:18,color:"1A1A1A"})],shading:{fill:"F2F4F6",type:ShadingType.CLEAR},spacing:{after:18},indent:{left:360}});

const mkT=(cols,widths,rows)=>{
  const total=widths.reduce((a,b)=>a+b,0);
  return new Table({width:{size:total,type:WidthType.DXA},columnWidths:widths,rows:[
    new TableRow({tableHeader:true,children:cols.map((c,i)=>new TableCell({borders:allB,width:{size:widths[i],type:WidthType.DXA},shading:{fill:C_BLUE,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[new TextRun({text:c,bold:true,color:C_WHITE,size:20})]})]}))
    }),
    ...rows.map((r,ri)=>new TableRow({children:r.map((c,i)=>new TableCell({borders:allB,width:{size:widths[i],type:WidthType.DXA},shading:{fill:ri%2===0?"EBF4FB":"FFFFFF",type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[new TextRun({text:c,size:20,color:C_GRAY})]})]}))}))
  ]});
};

const doc=new Document({
  numbering:{config:[
    {reference:"bul",levels:[
      {level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}},
      {level:1,format:LevelFormat.BULLET,text:"\u25e6",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:1080,hanging:360}}}}
    ]}
  ]},
  styles:{default:{document:{run:{font:"Arial",size:22}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:28,bold:true,font:"Arial"},paragraph:{spacing:{before:360,after:180},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:26,bold:true,font:"Arial"},paragraph:{spacing:{before:240,after:120},outlineLevel:1}},
      {id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:24,bold:true,font:"Arial"},paragraph:{spacing:{before:160,after:80},outlineLevel:2}},
    ]
  },
  sections:[{
    properties:{page:{size:{width:11906,height:16838},margin:{top:1134,right:1134,bottom:1134,left:1134}}},
    headers:{default:new Header({children:[new Paragraph({children:[new TextRun({text:"ClawCS \u6b27\u6001 CGM \u552e\u540e\u5e73\u53f0 \u2014 \u6280\u672f\u67b6\u6784\u8bbe\u8ba1\u6587\u6863 v1.0",size:18,color:"888888"})],border:{bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}}})]})},
    footers:{default:new Footer({children:[new Paragraph({children:[new TextRun({text:"\u00a9 2026 ClawCS\t",size:18,color:"AAAAAA"}),new TextRun({children:[PageNumber.CURRENT],size:18,color:"AAAAAA"}),new TextRun({text:" / ",size:18,color:"AAAAAA"}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:18,color:"AAAAAA"})],tabStops:[{type:"right",position:9026}],border:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}}})]})},
    children:[
      // \u5c01\u9762
      blank(),blank(),blank(),
      new Paragraph({children:[new TextRun({text:"ClawCS",bold:true,size:64,color:C_BLUE})],alignment:AlignmentType.CENTER,spacing:{after:100}}),
      new Paragraph({children:[new TextRun({text:"\u6b27\u6001 CGM \u552e\u540e\u667a\u80fd\u5ba2\u670d\u5e73\u53f0",size:38,color:C_MID,bold:true})],alignment:AlignmentType.CENTER,spacing:{after:100}}),
      new Paragraph({children:[new TextRun({text:"\u6280\u672f\u67b6\u6784\u8bbe\u8ba1\u6587\u6863 v1.0",size:28,color:"555555"})],alignment:AlignmentType.CENTER,spacing:{after:400}}),
      mkT(["\u7248\u672c","\u72b6\u6001","\u65e5\u671f"],[3002,3002,3522],[["v1.0","\u8349\u7a3f","2026-03-24"]]),
      pageBreak(),

      // 1. \u6982\u8ff0
      h1("1. \u6587\u6863\u6982\u8ff0\u4e0e\u8bbe\u8ba1\u539f\u5219"),
      body("\u672c\u6587\u6863\u63cf\u8ff0\u6b27\u6001 CGM \u552e\u540e\u667a\u80fd\u5ba2\u670d\u5e73\u53f0\u7684\u6574\u4f53\u6280\u672f\u67b6\u6784\uff0c\u8986\u76d6\u7cfb\u7edf\u5206\u5c42\u8bbe\u8ba1\u3001\u6838\u5fc3\u6a21\u5757\u8be6\u89e3\u3001\u6570\u636e\u5e93\u8bbe\u8ba1\u3001API \u89c4\u8303\u3001\u90e8\u7f72\u65b9\u6848\u53ca\u5408\u89c4\u5b89\u5168\u8981\u6c42\u3002"),
      h2("1.1 \u8bbe\u8ba1\u539f\u5219"),
      bullet("\u5065\u5eb7\u6570\u636e\u5408\u89c4\u4f18\u5148\uff1a\u8840\u7cd6\u6570\u636e\u5c5e\u654f\u611f\u4e2a\u4eba\u5065\u5eb7\u4fe1\u606f\uff0c\u5168\u94fe\u8def\u52a0\u5bc6\uff0c\u652f\u6301\u6570\u636e\u4e0d\u51fa\u57df\u79c1\u6709\u5316\u90e8\u7f72"),
      bullet("\u533b\u7597\u8d23\u4efb\u8fb9\u754c\u660e\u786e\uff1a\u6240\u6709 AI \u56de\u590d\u5c3e\u90e8\u5fc5\u987b\u5e26\u514d\u8d23\u58f0\u660e\uff0c\u4e25\u7981\u56de\u7b54\u75be\u75c5\u8bca\u65ad\u548c\u964d\u7cd6\u836f\u5242\u91cf\u76f8\u5173\u95ee\u9898"),
      bullet("\u4f4e\u5ef6\u8fdf\u548c\u9ad8\u53ef\u9760\u6027\uff1a\u7cd6\u5c3f\u75c5\u60a3\u8005\u7b49\u4e0d\u8d77\uff0c\u9996 Token \u54cd\u5e94\u2264 1.5s\uff0cSLA 99.9%"),
      bullet("\u77e5\u8bc6\u5e93\u9a71\u52a8\u56de\u7b54\uff1a\u6bcf\u4e2a\u56de\u590d\u5fc5\u987b\u57fa\u4e8e\u6b27\u6001\u5b98\u65b9\u6587\u6863\u6216 FAQ\uff0c\u7981\u6b62\u865e\u6784\u9020\u552e\u540e\u653f\u7b56"),
      bullet("14 \u5929\u4f7f\u7528\u5faa\u73af\u611f\u77e5\uff1a\u4f20\u611f\u5668\u5bff\u547d\u5468\u671f\u5185\u4e3b\u52a8\u63a8\u9001\u4f7f\u7528\u63d0\u793a\uff0c\u63d0\u5347\u7559\u5b58\u7387"),
      pageBreak(),

      // 2. \u7cfb\u7edf\u603b\u4f53\u67b6\u6784
      h1("2. \u7cfb\u7edf\u603b\u4f53\u67b6\u6784"),
      h2("2.1 \u4e94\u5c42\u67b6\u6784\u56fe"),
      ...["  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
"  \u2502         \u7b2c\u4e00\u5c42\uff1a\u6e20\u9053\u63a5\u5165\u5c42  (Channel Gateway)                \u2502",
"  \u2502  \u6b27\u6001\u5065\u5eb7 App \u5185\u5d4c  \u2502  Web \u5bf9\u8bdd\u6846  \u2502  \u5fae\u4fe1\u5c0f\u7a0b\u5e8f  \u2502  \u4f01\u4e1a\u5fae\u4fe1   \u2502",
"  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524 WebSocket/SSE/REST \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
"                            \u2502",
"  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
"  \u2502     \u7b2c\u4e8c\u5c42\uff1aAPI \u7f51\u5173 + JWT\u8ba4\u8bc1 + \u9650\u6d41 + \u4f1a\u8bdd\u7ba1\u7406          \u2502",
"  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
"         \u2502            \u2502            \u2502              \u2502",
"  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2510\u250c\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2510\u250c\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2510\u250c\u2500\u2500\u2500\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
"  \u2502 LLM\u5f15\u64ce\u670d\u52a1  \u2502\u2502  RAG\u77e5\u8bc6\u5e93  \u2502\u2502  \u4e1a\u52a1\u903b\u8f91  \u2502\u2502   \u4e3b\u52a8\u901a\u77e5    \u2502",
"  \u2502 Claude API   \u2502\u2502 CGM\u6587\u6863\u5e93 \u2502\u2502 \u5de5\u5355/\u5750\u5e2d/\u6743\u9650 \u2502\u2502 14\u5929\u5468\u671f\u63a8\u9001  \u2502",
"  \u2502 \u8bed\u4e49\u7f13\u5b58    \u2502\u2502 FAQ\u5e93    \u2502\u2502 \u7528\u6237\u53cd\u9988   \u2502\u2502 \u9ad8/\u4f4e\u8840\u7cd6\u9884\u8b66  \u2502",
"  \u2502 Tool Use     \u2502\u2502 \u552e\u540e\u653f\u7b56\u5e93 \u2502\u2502             \u2502\u2502               \u2502",
"  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
"                             \u2502",
"  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
"  \u2502 \u7b2c\u56db\u5c42\uff1a PostgreSQL + Redis + Milvus + MinIO + Celery    \u2502",
"  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
"  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
"  \u2502 \u7b2c\u4e94\u5c42\uff1a Kubernetes + OpenTelemetry + Prometheus + Grafana   \u2502",
"  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"
      ].map(code),
      blank(),

      h2("2.2 \u6280\u672f\u9009\u578b\u8868"),
      mkT(["\u5c42\u6b21","\u9009\u578b","\u9009\u578b\u7406\u7531"],[1800,2800,5128],[
        ["LLM \u5f15\u64ce","Claude claude-3-5-sonnet","200K \u4e0a\u4e0b\u6587\uff0c\u5185\u7f6e\u5b89\u5168\u6846\u67b6\uff0c\u964d\u4f4e\u5e7b\u89c9\u98ce\u9669"],
        ["LLM \u964d\u7ea7","GPT-4o / DeepSeek-V3 \u672c\u5730","Claude \u4e0d\u53ef\u7528\u65f6\u81ea\u52a8\u5207\u6362\uff0c\u652f\u6301\u6570\u636e\u4e0d\u51fa\u57df"],
        ["Embedding","text-embedding-3-large","1536\u7ef4\u9ad8\u7cbe\u5ea6\u591a\u8bed\u8a00\uff0c\u9002\u5408\u533b\u7597\u6587\u672c\u8bed\u4e49\u68c0\u7d22"],
        ["\u5411\u91cf\u6570\u636e\u5e93","Milvus v2.x","CGM FAQ\u5e93\u5b8c\u6574\u6587\u6863\u7d22\u5f15\uff0c\u652f\u6301 HNSW + IVF \u6df7\u5408"],
        ["\u8bed\u4e49\u7f13\u5b58","Redis + Sentence-Transformers","72% \u547d\u4e2d\u7387\u53ef\u964d\u4f4e LLM \u8c03\u7528 60%+"],
        ["\u4e3b\u6570\u636e\u5e93","PostgreSQL 16","ACID + RLS \u6570\u636e\u9694\u79bb\uff0c\u8840\u7cd6\u6570\u636e\u52a0\u5bc6\u5b58\u50a8"],
        ["\u6d88\u606f\u961f\u5217","Celery + Redis Broker","KB \u5f02\u6b65\u5efa\u7d22 + \u4e3b\u52a8\u901a\u77e5\u5c55\u6362\u4f20\u611f\u5668\u63d0\u9192"],
        ["\u540e\u7aef\u6846\u67b6","FastAPI (Python)","\u5f02\u6b65\u539f\u751f + SSE\u6d41\u5f0f\u8f93\u51fa + \u81ea\u52a8 OpenAPI \u6587\u6863"],
        ["\u524d\u7aef","Vue 3 + Vite","App \u5d4c\u5165 H5 + \u6b27\u6001\u5065\u5eb7 App SDK \u53cc\u6a21\u5f0f"],
        ["\u5bb9\u5668\u7f16\u6392","Kubernetes","HPA \u6c34\u5e73\u6269\u5bb9\uff0c\u652f\u6301\u79c1\u6709\u5316 Helm \u4ea4\u4ed8"]
      ]),
      pageBreak(),

      // 3. \u6838\u5fc3\u6a21\u5757
      h1("3. \u6838\u5fc3\u6a21\u5757\u8be6\u89e3"),
      h2("3.1 CGM \u552e\u540e\u77e5\u8bc6\u5e93 RAG \u5f15\u64ce"),
      h3("3.1.1 \u6587\u6863\u5904\u7406\u6d41\u6c34\u7ebf"),
      ...["  \u6b27\u6001\u5b98\u65b9\u6587\u4ef6 (PDF/DOCX/TXT/HTML)",
"       \u2502",
"       \u25bc",
"  \u6587\u6863\u89e3\u6790 (\u5c42\u7ea7\u6807\u9898\u8bc6\u522b + \u8868\u683c\u63d0\u53d6)",
"       \u2502",
"       \u25bc",
"  \u8bed\u4e49\u5206\u5757 (Chunk Size=256 token, Overlap=32 token)",
"  \u6ce8\u610f: CGM \u6587\u6863\u5206\u5757\u5c0f\u4e8e\u901a\u7528\u573a\u666f, \u4fdd\u8bc1\u5355\u4e00\u95ee\u9898\u7b54\u6848\u5b8c\u6574",
"       \u2502",
"       \u25bc",
"  \u5143\u6570\u636e\u591a\u7ef4\u6807\u6ce8 (doc_type: faq/manual/policy, device: M8, lang: zh)",
"       \u2502",
"       \u25bc",
"  Embedding \u5411\u91cf\u5316 (text-embedding-3-large 1536\u7ef4)",
"       \u2502",
"       \u25bc",
"  \u5199\u5165 Milvus + PostgreSQL\u5143\u6570\u636e",
"       \u2502",
"       \u25bc",
"  \u901a\u77e5\u5ba1\u6838\u4eba\u5458\u786e\u8ba4\u77e5\u8bc6\u5e93\u751f\u6548"
      ].map(code),
      blank(),

      h3("3.1.2 \u77e5\u8bc6\u5e93\u5206\u7c7b\u4e0e\u5143\u6570\u636e"),
      mkT(["\u77e5\u8bc6\u5e93\u5206\u7c7b","\u6587\u6863\u793a\u4f8b","\u4f18\u5148\u7ea7"],[ 2500,4500,2526],[
        ["FAQ \u7c7b (\u6700\u9ad8\u4f18\u5148\u7ea7)","\u84dd\u7259\u65ad\u8fde\u600e\u4e48\u529e / NFC \u6fc0\u6d3b\u5931\u8d25 / \u6570\u636e\u504f\u5dee\u539f\u56e0","P0"],
        ["\u4f7f\u7528\u624b\u518c\u7c7b","\u6b27\u6001 M8 \u5b98\u65b9\u4f7f\u7528\u8bf4\u660e\u4e66 / App \u529f\u80fd\u64cd\u4f5c\u6307\u5357","P0"],
        ["\u552e\u540e\u653f\u7b56\u7c7b","\u4fdd\u8d28\u671f\u8303\u56f4 / \u9000\u6362\u8d27\u6761\u4ef6 / \u4e0d\u5c5e\u4e8e\u552e\u540e\u7684\u573a\u666f\u8bf4\u660e","P0"],
        ["\u533b\u5b66\u5e38\u8bc6\u7c7b","\u300a\u6301\u7eed\u8461\u8404\u7cd6\u76d1\u6d4b\u4e34\u5e8a\u5e94\u7528\u4e13\u5bb6\u5171\u8bc6 2024\u300b\u8282\u9009","P1"],
        ["App \u66f4\u65b0\u65e5\u5fd7\u7c7b","\u6b27\u6001\u5065\u5eb7 App v1.37.x \u66f4\u65b0\u8bf4\u660e","P1"],
        ["\u7cbe\u5c42\u5185\u5bb9\u7c7b","\u7cd6\u5c3f\u75c5\u9a7e\u8f66\u3001\u7cd6\u53cb\u793e\u533a\u5e38\u89c1\u64cd\u4f5c\u6280\u5de7","P2"]
      ]),
      blank(),

      h3("3.1.3 \u5b89\u5168\u8fc7\u6ee4\u5c42\u8bbe\u8ba1"),
      body("\u4e3a\u9632\u6b62 AI \u56de\u7b54\u5371\u9669\u533b\u7597\u5185\u5bb9\uff0c\u8bbe\u7f6e\u4e09\u9053\u8fc7\u6ee4\u9632\u7ebf\uff1a"),
      ...["  \u7528\u6237\u8f93\u5165",
"       \u2502",
"       \u25bc",
"  [\u8fc7\u6ee4\u5c42 1] \u610f\u56fe\u8bc6\u522b: \u68c0\u6d4b\u662f\u5426\u542b\u5965\u96be\u533b\u7597\u54a8\u8be2 (Claude \u83f1\u82a5\u5206\u7c7b)",
"  \u2193 \u544a\u8b66\u578b (\u5982\u201c\u6211\u8840\u7cd6 25\u201d) \u2192 \u81ea\u52a8\u8f6c\u4e0a\u7d27\u6025\u5c31\u533b\u5907\u6ce8 + \u8f6c\u5750\u5e2d",
"       \u2502",
"       \u25bc",
"  [\u8fc7\u6ee4\u5c42 2] Claude \u7cfb\u7edf Prompt\u9632\u6ce8\u5165 + \u5185\u5bb9\u5ba1\u67e5",
"  \u2193 \u8f93\u51fa\u5305\u542b\u75be\u75c5\u8bca\u65ad / \u836f\u7269\u5242\u91cf \u2192 \u81ea\u52a8\u66ff\u6362\u514d\u8d23\u58f0\u660e",
"       \u2502",
"       \u25bc",
"  [\u8fc7\u6ee4\u5c42 3] \u56de\u590d\u5c3e\u90e8\u81ea\u52a8\u9644\u52a0: \u201c\u4ee5\u4e0a\u4fe1\u606f\u4e0d\u6784\u6210\u533b\u7597\u5efa\u8bae\uff0c\u8bf7\u9012\u8be2\u60a8\u7684\u533b\u751f\u201d"
      ].map(code),
      blank(),
      pageBreak(),

      h2("3.2 LLM \u5f15\u64ce\u670d\u52a1\u8bbe\u8ba1"),
      h3("3.2.1 \u7cfb\u7edf Prompt \u6a21\u677f\uff08\u6b27\u6001 CGM \u552e\u540e\u5c08\u7528\uff09"),
      ...['  [SYSTEM PROMPT - \u79df\u6237\u53ef\u81ea\u5b9a\u4e49\u90e8\u5206]',
'  \u4f60\u662f\u300c\u6b27\u6001\u5065\u5eb7\u300d\u7684 AI \u552e\u540e\u5927\u5e08\uff0c\u5c06\u5e2e\u52a9\u6b27\u6001 M8 \u52a8\u6001\u8840\u7cd6\u4eea\u7528\u6237\u89e3\u51b3\u552e\u540e\u95ee\u9898\u3002',
'',
'  \u56de\u7b54\u89c4\u8303:',
'  1. \u53ea\u57fa\u4e8e\u63d0\u4f9b\u7684\u77e5\u8bc6\u5e93\u5185\u5bb9\u56de\u7b54, \u4e0d\u53ef\u634f\u9020\u552e\u540e\u653f\u7b56',
'  2. \u4e25\u7981\u56de\u7b54\u836f\u7269\u5242\u91cf\u3001\u75be\u75c5\u8bca\u65ad\u3001\u6cbb\u7597\u65b9\u6848',
'  3. \u8840\u7cd6\u8fc7\u9ad8/\u8fc7\u4f4e\u76f8\u5173\u95ee\u9898\u5fc5\u987b\u5c55\u793a\u7d27\u6025\u5c31\u533b\u63d0\u793a',
'  4. \u8bed\u8a00\u98ce\u683c: \u5e73\u9636\u89e3\u91ca\uff0c\u50cf\u4e00\u4e2a\u61c2\u7cd6\u5c3f\u75c5\u7684\u8010\u5fc3\u670b\u53cb, \u907f\u514d\u533b\u5b66\u672f\u8bed',
'  5. \u6bcf\u6761\u56de\u590d\u7ed3\u5c3e\u9644\u52a0\u514d\u8d23\u58f0\u660e',
'  6. \u5982\u65e0\u6cd5\u89e3\u7b54, \u660e\u786e\u8bf4\u660e\u5e76\u5f15\u5bfc\u8f6c\u4eba\u5de5',
'',
'  [RAG \u68c0\u7d22\u5185\u5bb9\u63d2\u5165\u4f4d\u7f6e]',
'  \u77e5\u8bc6\u5e93\u5339\u914d\u7247\u6bb5: {retrieved_chunks}',
'  \u5f15\u7528\u6765\u6e90: {sources}'
      ].map(code),
      blank(),

      h3("3.2.2 Tool Use \u5de5\u5177\u96c6"),
      mkT(["\u5de5\u5177","\u63cf\u8ff0","\u89e6\u53d1\u573a\u666f"],[2200,3500,4026],[
        ["query_order_status","\u67e5\u8be2\u8ba2\u5355\u72b6\u6001\u548c\u7269\u6d41\u4fe1\u606f","\u7528\u6237\u54a8\u8be2\u201c\u6211\u7684\u8ba2\u5355\u5728\u54ea\u91cc\u201d"],
        ["create_aftersale_ticket","\u521b\u5efa\u552e\u540e\u5de5\u5355\uff08\u8d28\u91cf/\u66ff\u6362/\u6295\u8bc9\uff09","\u786e\u8ba4\u7b26\u5408\u6362\u8d27\u6761\u4ef6\u540e"],
        ["check_sensor_warranty","\u6838\u9a8c\u4f20\u611f\u5668\u662f\u5426\u5728\u4fdd\u8d28\u671f\u5185","\u7528\u6237\u8bf4\u201c\u4f20\u611f\u5668\u574f\u4e86\u201d\u65f6"],
        ["get_product_manual","\u8fd4\u56de\u6b27\u6001 M8 \u7279\u5b9a\u7ae0\u8282\u7684\u624b\u518c\u539f\u6587","\u7528\u6237\u95ee\u201c\u6fc0\u6d3b\u6b65\u9aa4\u662f\u4ec0\u4e48\u201d"],
        ["get_app_guide","\u8fd4\u56de\u6b27\u6001\u5065\u5eb7 App \u529f\u80fd\u64cd\u4f5c\u8bf4\u660e","\u7528\u6237\u95ee\u201c\u600e\u4e48\u8bbe\u7f6e\u8b66\u62a5\u201d"],
        ["escalate_to_agent","\u5c06\u5bf9\u8bdd\u8f6c\u63a5\u5230\u4eba\u5de5\u5750\u5e2d","AI 2 \u6b21\u65e0\u6cd5\u89e3\u51b3\u6216\u7528\u6237\u8981\u6c42\u4eba\u5de5"]
      ]),
      blank(),

      h2("3.3 14 \u5929\u4f7f\u7528\u5faa\u73af\u4e3b\u52a8\u63a8\u9001\u8bbe\u8ba1"),
      body("\u9488\u5bf9\u4f20\u611f\u5668 14 \u5929\u5bff\u547d\u5468\u671f\uff0c\u8bbe\u8ba1\u81ea\u52a8\u5316\u903b\u8f91\u63d0\u5347\u7528\u6237\u4f53\u9a8c\u548c\u66f4\u6362\u8fc7\u6cd5\u7387\uff1a"),
      mkT(["\u4f69\u6234\u5929\u6570","\u89e6\u53d1\u4e8b\u4ef6","\u63a8\u9001\u5185\u5bb9"],[1500,3000,5026],[
        ["D+0\uff08\u5c01\u4e0a\u540e\u9884\u8ba1\uff09","\u65b0\u8ba2\u5355\u53d1\u51fa","\u300c\u65b0\u4f20\u611f\u5668\u4f7f\u7528\u5c0f\u8d34\u58eb\u300d: \u6fc0\u6d3b\u6d41\u7a0b + NFC \u6ce8\u610f\u4e8b\u9879"],
        ["D+1\uff08\u6fc0\u6d3b\u540e\u7b2c 1 \u5929\uff09","\u4f20\u611f\u5668\u5df2\u6fc0\u6d3b","\u300c\u706b\u529b\u5168\u5f00\u2705\u300d: \u8b66\u62a5\u9608\u5024\u8bbe\u7f6e\u63d0\u793a + 3 \u5929\u53e0\u52a0\u529f\u80fd\u4ecb\u7ecd"],
        ["D+12","\u8ba1\u5c97\u9884\u8b66","\u300c\u4f20\u611f\u5668\u5c06\u4e8e 2 \u5929\u540e\u5230\u671f\u300d: \u63d0\u9192\u63f4\u5907\u65b0\u4f20\u611f\u5668"],
        ["D+13","\u5c71\u96e8\u6b32\u6765","\u300c\u660e\u5929\u5c31\u8981\u5230\u671f\u5566\u300d: \u4e00\u952e\u8df3\u8f6c\u8d2d\u4e70\u5165\u53e3\uff0c\u9644\u5386\u53f2\u8840\u7cd6\u62a5\u544a"],
        ["D+14","\u5230\u671f\u5f53\u5929","\u300c\u4f20\u611f\u5668\u5df2\u5230\u671f\u300d: \u5f15\u5bfc\u5b89\u5168\u62d9\u4e0b + \u4e0b\u4e2a\u5468\u671f\u8bbe\u5907\u6307\u5357"],
        ["\u4efb\u610f\u5929 HI/LO","\u8840\u7cd6\u8d85\u51fa 22 mmol/L \u6216 < 3.9","\u5c31\u533b\u63d0\u9192\u5e2d 2 \u5206\u949f\uff0c\u5373\u63a8\u5c31\u533b\u5efa\u8bae"]
      ]),
      pageBreak(),

      // 4. \u6570\u636e\u5e93
      h1("4. \u6570\u636e\u5e93\u8bbe\u8ba1\u6982\u89c8"),
      h2("4.1 \u6838\u5fc3\u8868\u6e05\u5355"),
      mkT(["\u8868\u540d","\u5173\u952e\u5b57\u6bb5","\u654f\u611f\u7b49\u7ea7"],[2500,5000,2026],[
        ["sensor_devices","id, user_id, serial_no, activated_at, expires_at, status","\u4e2d"],
        ["sensor_readings","\u8bfb\u6570 ID / \u7528\u6237 ID / \u8461\u8404\u7cd6\u503c(\u52a0\u5bc6) / \u65f6\u95f4\u6233 / \u6e20\u9053","\u9ad8 - \u5bf9\u5e94\u4e2a\u4eba\u5065\u5eb7\u4fe1\u606f"],
        ["aftersale_tickets","id, user_id, device_serial, type, status, priority, created_at","\u4e2d"],
        ["push_campaigns","id, user_id, day_offset, trigger_event, content_template, sent_at","\u4f4e"],
        ["kb_documents","id, category, doc_type, title, version, status, reviewed_by","\u4f4e"],
        ["chat_sessions","id, user_id, channel, status, messages_count","\u4e2d"],
        ["chat_messages","id, session_id, role, content(\u52a0\u5bc6 AES-256), llm_model","\u9ad8"]
      ]),
      blank(),
      new Paragraph({children:[new TextRun({text:"\u26a0\ufe0f sensor_readings \u548c chat_messages \u8868\u7684\u5185\u5bb9\u5b57\u6bb5\u5fc5\u987b\u5e94\u7528\u5217\u7ea7\u52a0\u5bc6\uff0cPostgreSQL pgcrypto \u6216\u5e94\u7528\u5c42 AES-256\uff0c\u660e\u6587\u4e0d\u5f97\u5c51\u5165\u5e94\u7528\u65e5\u5fd7\u3002",size:20,bold:true,color:"BF360C"})],shading:{fill:"FFF3E0",type:ShadingType.CLEAR},spacing:{before:100,after:100},indent:{left:360}}),
      blank(),

      // 5. \u5b89\u5168\u5408\u89c4
      h1("5. \u5b89\u5168\u4e0e\u5408\u89c4\u67b6\u6784"),
      h2("5.1 \u5065\u5eb7\u6570\u636e\u7ea7\u9632\u62a4"),
      mkT(["\u5c42\u6b21","\u63aa\u65bd"],[2000,7526],[
        ["\u4f20\u8f93\u5c42","TLS 1.3 \u5168\u7a0b\u52a0\u5bc6\uff0cHSTS\uff0c\u624b\u673a\u7aef\u8bc1\u4e66\u9501\u5b9a"],
        ["\u5b58\u50a8\u5c42","\u8840\u7cd6\u8bfb\u6570\u548c\u5bf9\u8bdd\u5185\u5bb9 AES-256 \u52a0\u5bc6\uff0cClaude API Key \u7ecf KMS \u52a0\u5bc6\u5b58\u50a8"],
        ["\u8bbf\u95ee\u5c42","PostgreSQL Row-level Security\uff0c\u7528\u6237\u53ea\u80fd\u8bbf\u95ee\u81ea\u5df1\u7684\u8840\u7cd6\u6570\u636e"],
        ["\u6a21\u578b\u5c42","Claude Constitutional AI + \u81ea\u5b9a\u4e49 Prompt\u9632\u6ce8\u5165 + \u533b\u7597\u8d23\u4efb\u8fc7\u6ee4\u5c42"],
        ["\u5ba1\u8ba1\u5c42","\u6240\u6709\u5de5\u5355\u64cd\u4f5c\u548c AI \u56de\u590d\u65e5\u5fd7\u7559\u5b58 180 \u5929\uff0c\u652f\u6301\u5408\u89c4\u5bfc\u51fa"],
        ["\u9694\u79bb\u5c42","\u591a\u79df\u6237\uff08\u4e0d\u540c\u7ecf\u9500\u5546\uff09RLS \u9694\u79bb\uff0c\u7edd\u5bf9\u7981\u6b62\u8de8\u79df\u6237\u67e5\u8be2"]
      ]),
      blank(),

      h2("5.2 \u5408\u89c4\u58f0\u660e\u81ea\u52a8\u5316"),
      bullet("AI \u56de\u590d\u5c3e\u90e8\u81ea\u52a8\u6ce8\u5165\u514d\u8d23\u58f0\u660e\u6a21\u677f"),
      bullet("\u79d1\u666e\u7c7b\u5185\u5bb9\u6807\u6ce8\u300c\u6b64\u5185\u5bb9\u4ec5\u4f9b\u53c2\u8003\u300d"),
      bullet("\u5185\u5d4c\u5ba2\u670d\u4e0d\u652f\u6301\u76f4\u63a5\u63d0\u4f9b\u7528\u836f\u5efa\u8bae\uff0c\u786e\u8ba4\u534f\u8bae\u5c55\u793a"),
      bullet("\u8840\u7cd6 HI \u8d85\u8fc7 22 mmol/L \u6216 LO \u4f4e\u4e8e 3.9 mmol/L \u5f39\u51fa\u7d27\u6025\u5c31\u533b\u63d0\u9192\uff0c\u65e0\u8bba AI \u662f\u5426\u6b63\u5728\u56de\u7b54"),
      pageBreak(),

      // 6. \u90e8\u7f72
      h1("6. \u90e8\u7f72\u65b9\u6848"),
      h2("6.1 K8s \u670d\u52a1\u6e05\u5355"),
      mkT(["\u670d\u52a1","\u526f\u672c\u6570","\u8d44\u6e90","HPA \u89e6\u53d1\u6761\u4ef6"],[2500,1200,2500,3326],[
        ["llm-proxy","3","4C/8G","CPU>60% \u6216\u8bf7\u6c42\u961f\u5217>100"],
        ["rag-engine","2","4C/8G","CPU>70%"],
        ["session-service","2","2C/4G","CPU>70%"],
        ["push-service","2","2C/4G","\u961f\u5217\u79ef\u538b>500"],
        ["worker (Celery KB\u5efa\u7d22)","3","2C/4G","\u961f\u5217\u79ef\u538b>1000"]
      ]),
      blank(),

      h2("6.2 \u79c1\u6709\u5316\u90e8\u7f72\u9009\u9879"),
      bullet("\u6807\u51c6\u516c\u6709\u4e91\uff1aAliyun / Tencent Cloud K8s + Claude API\uff08\u7f51\u7edc\u53ef\u8fbe\uff09"),
      bullet("\u6570\u636e\u4e0d\u51fa\u57df\u65b9\u6848\uff1a\u79c1\u6709\u5316 K8s \u96c6\u7fa4 + \u672c\u5730 DeepSeek-V3 GPU \u8282\u70b9\uff0c\u5b8c\u5168\u79bb\u7ebf"),
      bullet("\u4ea4\u4ed8\u7269\uff1aHelm Charts + \u81ea\u52a8\u5316\u90e8\u7f72\u811a\u672c + \u8fd0\u7ef4\u624b\u518c"),
      blank(),

      // 7. \u53d8\u66f4
      h1("7. \u53d8\u66f4\u8bb0\u5f55"),
      mkT(["\u7248\u672c","\u65e5\u671f","\u53d8\u66f4\u8bf4\u660e"],[1500,2000,6026],[
        ["v1.0","2026-03-24","\u521d\u7248\uff0c\u57fa\u4e8e\u6b27\u6001 M8 + \u6b27\u6001\u5065\u5eb7 App v1.37 \u5b9e\u9645\u4ea7\u54c1\u8d44\u6599\u7f16\u5199"]
      ]),
      blank()
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("docs/02_\u6280\u672f\u67b6\u6784\u8bbe\u8ba1\u6587\u6863_\u6b27\u6001CGM\u552e\u540e\u7248.docx", buf);
  console.log("\u2705 \u6280\u672f\u67b6\u6784\u6587\u6863\uff08\u6b27\u6001CGM\u552e\u540e\u7248\uff09\u751f\u6210\u6210\u529f");
});
