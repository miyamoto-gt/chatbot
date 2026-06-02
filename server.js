// ライブラリ
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "tamplate")));

// Gemini APIキーの取得
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("GEMINI_API_KEY が設定されていません。RenderのEnvironment Variables または .env を確認してください。");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;



// dataフォルダを作成
const dataDir = path.join(__dirname, "data");
const historyPath = path.join(dataDir, "history.json");

function ensureHistoryFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, "[]", "utf-8");
  }
}

// history.json 読み込み
function loadHistory() {
  ensureHistoryFile();

  try {
    const data = fs.readFileSync(historyPath, "utf-8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("history.json 読み込みエラー:", error);
    return [];
  }
}

// history.json 保存
function saveHistory(history) {
  ensureHistoryFile();

  fs.writeFileSync(
    historyPath,
    JSON.stringify(history, null, 2),
    "utf-8"
  );
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "tamplate", "chat.html"));
});

app.get("/outline", (req, res) => {
  res.sendFile(path.join(__dirname, "tamplate", "outline.html"));
});

// 動作確認用
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "server is running"
  });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.json({
      reply: "質問内容が空です。機械学習で困っていることを入力してください。"
    });
  }

  if (!genAI) {
    return res.status(500).json({
      reply: "APIキーが設定されていません。RenderのEnvironment Variables または .env を確認してください。"
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
あなたは機械学習を学ぶ方に対しての学習支援チャットボットです。

目的:
機械学習の勉強中に困ったことを、初学者にも分かるように説明すること。

回答ルール:
・専門用語はできるだけ簡単に説明する
・必要ならPythonや機械学習の具体例を入れる
・長すぎず、理解しやすく答える
・質問者が自分で実装できるように、考え方も説明する
・活用例についても触れること

質問:
${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text() || "回答を生成できませんでした。";

    // 会話内容を history.json に保存
    const history = loadHistory();

    const record = {
      id: Date.now(),
      date: new Date().toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo"
      }),
      question: message,
      answer: reply
    };

    history.push(record);
    saveHistory(history);

    res.json({
      reply: reply
    });

  } catch (error) {
    console.log("チャットエラー:", error);

    res.status(500).json({
      reply: "エラーが発生しました。APIキーや通信状態を確認してください。"
    });
  }
});

app.get("/history", (req, res) => {
  const history = loadHistory();

  res.json({
    history: history
  });
});

app.get("/summary", async (req, res) => {
  if (!genAI) {
    return res.status(500).json({
      summary: "APIキーが設定されていません。RenderのEnvironment Variables または .env を確認してください。"
    });
  }

  try {
    const history = loadHistory();

    if (history.length === 0) {
      return res.json({
        summary: "まだ学習履歴がありません。chat.htmlで機械学習について質問すると、ここに学習まとめが表示されます。"
      });
    }

    // 直近30件だけ要約対象にする
    const recentHistory = history.slice(-30);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
以下は、機械学習を学習している人のチャット履歴です。

${JSON.stringify(recentHistory, null, 2)}

この履歴をもとに、次の形式で学習内容をまとめてください。

【学習した内容】
・

【理解できたこと】
・

【まだ復習が必要なこと】
・

【次に学ぶとよいこと】
・

【今日の学習まとめ】
200文字程度でまとめる

条件:
・機械学習初学者が振り返りやすい内容にする
・専門用語は短く補足する
・質問と回答から分かる内容だけを使う
・箇条書きを中心にする
`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text() || "要約を生成できませんでした。";

    res.json({
      summary: summary
    });

  } catch (error) {
    console.log("要約エラー:", error);

    res.status(500).json({
      summary: "要約中にエラーが発生しました。"
    });
  }
});

app.post("/clear-history", (req, res) => {
  saveHistory([]);

  res.json({
    message: "学習履歴を削除しました。"
  });
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});