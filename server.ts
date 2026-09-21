import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization for Gemini AI SDK
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// API: AI metallurgical consultation for material substitution
app.post("/api/ai-material-consult", async (req, res) => {
  try {
    const { customerReq, product, overallScore, scores, chemEvaluation, mechEvaluation } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        analysis: null,
        message: "GEMINI_API_KEY not configured, will use local metallurgical engineering engine.",
      });
    }

    const prompt = `你是一位拥有20年特种钢材及高端合金材料选材经验的冶金工程技术专家。
针对客户提供的材质需求参数与公司推荐的相近产品，请出具一份严谨、客观、专业的《材料工程替代研判意见》。

【客户需求输入】
- 目标牌号: ${customerReq?.targetGrade || '未指定'}
- 执行标准: ${customerReq?.standard || '未指定'}
- 交货状态: ${customerReq?.deliveryState || '未限定'}
- 工况应用场景: ${customerReq?.application || '通用机械工程'}
- 化学成分要求: ${JSON.stringify(customerReq?.chemical || {})}
- 力学性能要求: ${JSON.stringify(customerReq?.mechanical || {})}

【我司推荐替代产品】
- 内部牌号: ${product?.code} (${product?.name})
- 执行标准: ${product?.standard}
- 交货状态: ${product?.deliveryState}
- 跨国等效牌号: 国标GB(${product?.equivalentGrades?.gb || '-'}), 美标ASTM(${product?.equivalentGrades?.astm || '-'}), 欧标EN(${product?.equivalentGrades?.en || '-'}), 日标JIS(${product?.equivalentGrades?.jis || '-'})
- 综合匹配得分: ${overallScore}% (牌号:${scores?.gradeScore}%, 成分:${scores?.chemScore}%, 力学:${scores?.mechScore}%)

请从以下四个维度进行专业深入研判并输出 Markdown 格式：
### 1. 替代对标可行性与标准合规评定
（分析在 GB/ASTM/EN 等级中的等效性及是否满足客户图纸的技术门槛）
### 2. 微观组织与热处理淬透性分析
（分析基体金相组织、回火稳定性、纯净度控制及淬透性表现）
### 3. 现场冷热成型与焊接工艺指导
（结合碳当量CEV或耐蚀指数PREN给出预热温度、焊材牌号推荐及切削机加工注意点）
### 4. 客户技术抗辩与商务说服要点
（分析强度安全裕度富余量、供货交期保障与产品质保书MTC凭据）`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("AI consultation endpoint error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI consultation" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
