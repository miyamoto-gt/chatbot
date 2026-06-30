# 機械学習用勉強支援チャットボット

## 概要

本プロジェクトは、Gemini APIを活用して作成した機械学習学習者向けのAIチャットボットである。
ユーザーが機械学習やLLMなどの学習中に疑問に思ったことを入力すると、AIが初学者にも分かりやすい形で回答する。

私は2026年3月頃から、機械学習やLLMについて個人で学習を進めている。その中で、分からないことを気軽に質問でき、自分が知りたい内容に合わせて回答してくれるAIチャットボットがほしいと考えた。

また、既存のAIチャットボットでは、質問に対して回答を返すことが中心であり、回答を読んで終わってしまうことが多い。そこで本プロジェクトでは、質問と回答の履歴を保存し、その内容をもとに「何を学んだのか」「どのような知識が身についたのか」をAIが要約できる機能も実装した。

これにより、単にAIに質問するだけでなく、学習内容を後から振り返ることができるWebアプリを目指した。

---
## 目次
* **[1. Webサイトの説明](#webサイトの説明)**
* **[2. プロジェクト概要](#プロジェクト概要)**
* **[3. ファイルごとの説明](#各ファイルの説明)**
* **[4. コードの説明](#コードの説明)**
* **[5. 工夫した点](#工夫した点)**
* **[6. 苦労した点](#苦労した点)**
* **[7. 学んだこと](#学んだこと)**
* **[8. 今後の課題](#今後の課題)**
* **[9. 起動方法](#起動方法)**
* **[10. 参考文献](#参考文献)**





## WEBサイトの説明

<img src="https://github.com/user-attachments/assets/bbc1cfff-12cd-4df5-8dee-46815d5f4c34" alt="image" style="max-width: 100%; height: auto;">

### 1.画面下部の入力欄に質問したい内容を入力します
### 2.送信ボタンを押すと少し時間を置いた後に回答が出ます
<img src="https://github.com/user-attachments/assets/730b11cf-9f01-47a0-90e7-f6a5dedbf591" alt="image" style="max-width: 100%; height: auto;">

### 3.学習内容を振り返りたい場合は、画面上部の「学習まとめを見る」ボタンを押します
### 4.下の画像のように「学習内容を要約する」ボタンを押すと、これまでの学習内容を振り返るための要約を確認できます
<img src="https://github.com/user-attachments/assets/ed0a6e29-9453-45af-a510-4210e0a63d41" alt="image" style="max-width: 100%; height: auto;">

### 5.下の画像の「要約後に履歴を削除」を押すとこれまでの履歴をリセットできる


<img src="https://github.com/user-attachments/assets/115062fd-92f2-4e2f-bfc2-689590e44e29" alt="image" style="max-width: 100%; height: auto;">

---
## プロジェクト概要
### 開発目的

本プロジェクトの目的は、既存のAI APIを利用して、実際に動作するWebアプリケーションを開発することである。

特に、以下の内容を理解することを目的とした。

* JavaScriptによるフロントエンド処理
* fetch、async/awaitを用いた非同期通信
* Node.js / Expressによるバックエンド処理
* Gemini APIとの連携
* JSONファイルを用いた会話履歴の保存
* 保存した履歴をもとにしたAI要約機能
* Renderを用いたWebアプリの公開

---

### 主な機能

* ユーザーが質問を入力できるチャット画面
* Gemini APIによるAI回答生成
* ユーザーとAIの会話をチャット形式で表示
* 回答待ちの間に「考え中...」を表示
* Enterキーによる送信
* Shift + Enterによる改行
* 質問と回答の履歴を `history.json` に保存
* 保存された会話履歴の表示
* 会話履歴をもとにした学習内容の要約
* 要約後の履歴削除
* スマートフォン画面へのレスポンシブ対応

---

### 使用技術

| 分類      | 使用技術                    |
| ------- | ----------------------- |
| フロントエンド | HTML / CSS / JavaScript |
| バックエンド  | Node.js / Express       |
| AI API  | Gemini API              |
| データ保存   | JSON                    |
| 環境変数管理  | dotenv                  |
| デプロイ    | Render                  |

---

### アプリの流れ

本アプリでは、まずユーザーがチャット画面で質問を入力する。
入力された質問はJavaScriptで取得され、`fetch` を用いてバックエンドの `/chat` にPOST送信される。

バックエンドでは、受け取った質問をGemini APIに送信し、AIの回答を取得する。
取得した回答はフロントエンドへJSON形式で返され、チャット画面に表示される。

また、質問と回答の内容は `data/history.json` に保存される。
学習まとめページでは、この保存された会話履歴を読み込み、Gemini APIを用いて学習内容を要約する。

処理の流れは以下の通りである。

```text
ユーザーが質問を入力
↓
JavaScriptで入力内容を取得
↓
fetch("/chat") でバックエンドへ送信
↓
Express側の /chat が質問を受け取る
↓
Gemini APIへ質問を送信
↓
AIの回答を取得
↓
質問と回答を history.json に保存
↓
回答をチャット画面に表示
↓
/summary で保存履歴を要約
```

---

### ファイル構成

```text
chatbot/
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── data/
│   └── history.json
└── tamplate/
    ├── chat.html
    ├── outline.html
    └── style.css
```

## 各ファイルの説明

### server.js

`server.js` は、学習支援チャットボットのバックエンド処理を担当するファイルである。
Node.jsとExpressを用いてWebサーバーを構築し、チャット画面の表示、Gemini APIとの通信、会話履歴の保存、学習内容の要約、履歴削除を行っている。

`dotenv` を用いて環境変数から `GEMINI_API_KEY` を取得し、APIキーをコード内に直接書かずに管理している。これにより、GitHubに公開する際にAPIキーが漏れないようにしている。

`/chat` では、フロントエンドから送られてきた質問を受け取り、Gemini APIに送信する。AIから返ってきた回答は、フロントエンドへJSON形式で返すと同時に、`data/history.json` に質問・回答・日時を保存している。

`/history` では、保存された会話履歴を読み込み、学習まとめ画面へ返す。
`/summary` では、直近30件の会話履歴をGemini APIに送信し、学習した内容、理解できたこと、復習が必要なこと、次に学ぶとよいことを要約する。

また、`/clear-history` では、要約後に保存された会話履歴を削除できるようにしている。履歴はJSONファイルで管理し、ファイルが存在しない場合は自動で `data` フォルダと `history.json` を作成するようにした。

---

### chat.html

`chat.html` は、学習支援チャットボットのメイン画面を作成するファイルである。
この画面では、ユーザーが機械学習やLLMなどの学習中に疑問に思ったことを入力し、AIから回答を得ることができる。

画面上には、アプリのタイトル、説明文、学習まとめページへのリンク、チャット表示欄、質問入力欄、送信ボタンを配置した。

ユーザーが質問を入力して送信すると、JavaScriptで入力内容を取得し、`fetch` を用いてバックエンドの `/chat` にPOSTリクエストを送信する。
バックエンドからはAIの回答がJSON形式で返され、その内容をチャット画面に表示する。

また、送信直後には「考え中...」というメッセージを一時的に表示し、回答が返ってきた後に削除することで、ユーザーが処理中であることを分かりやすくした。

さらに、送信ボタンだけでなくEnterキーでも送信できるようにし、Shift + Enterでは改行できるようにした。これにより、チャットアプリとして自然に使える入力操作を実装した。

---

### outline.html

`outline.html` は、チャットで保存された会話履歴をもとに、学習内容を振り返るためのページである。
このページでは、保存された会話履歴を表示し、AIによる学習内容の要約を作成できる。

ページ読み込み時には、JavaScriptの `loadHistory()` によってバックエンドの `/history` にアクセスし、JSONに保存された会話履歴を取得する。取得した履歴は新しい順に並べ替えて、画面上に表示する。

また、「学習内容を要約する」ボタンを押すと、`createSummary()` が実行され、バックエンドの `/summary` にアクセスする。バックエンド側では、保存された会話履歴をもとにGemini APIを利用して要約を作成し、その結果をフロントエンドに返す。返ってきた要約は、画面上の要約欄に表示される。

さらに、「要約後に履歴を削除」ボタンを押すことで、`clearHistory()` が実行される。削除前には確認画面を表示し、ユーザーが承認した場合のみ `/clear-history` にPOSTリクエストを送信して履歴を削除する。

履歴を画面に表示する際には、`escapeHtml()` を用いてHTMLエスケープ処理を行っている。これにより、ユーザーの入力内容がHTMLタグとして実行されないようにし、安全性にも配慮した。

---

### style.css

`style.css` は、チャット画面と学習まとめ画面の見た目を整えるためのCSSファイルである。
全体の背景色、文字のフォント、カード型のレイアウト、ボタン、入力欄、チャットメッセージ、学習要約欄、履歴表示欄などのデザインを設定している。

チャット画面では、ユーザーのメッセージを右側、AIのメッセージを左側に表示することで、会話の流れを分かりやすくした。
また、メッセージ欄には `white-space: pre-wrap;` を指定し、AIの回答に含まれる改行が反映されるようにしている。

入力欄と送信ボタンは、PC画面では横並びにし、スマートフォンでは縦並びになるようにした。
`@media (max-width: 600px)` を用いてレスポンシブ対応を行い、画面幅が狭い場合でもボタンやメッセージが見やすく表示されるように調整した。

学習まとめ画面では、AIによる要約欄や保存された会話履歴をカード型に表示し、学習内容を振り返りやすい構成にした。
削除ボタンには赤色を使用し、履歴削除のような注意が必要な操作であることが分かるようにした。

---

## コードの説明

### 1. チャット送信処理

`chat.html` では、ユーザーが入力した質問を取得し、`fetch()` を用いてバックエンドの `/chat` に送信している。

```js
const response = await fetch("/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: message
  })
});
```

この処理では、入力された質問をJSON形式に変換し、POSTリクエストとしてサーバーに送信している。
`Content-Type` に `application/json` を指定することで、サーバー側がJSON形式のデータとして受け取れるようにしている。

送信されたデータは、バックエンド側の `/chat` で受け取られる。

```js
app.post("/chat", async (req, res) => {
  const { message } = req.body;
});
```

ここでは、`req.body` からフロントエンドで入力された質問内容を取り出している。
`message` が空の場合は、Gemini APIに送信せず、入力を促すメッセージを返すようにした。

```js
if (!message || message.trim() === "") {
  return res.json({
    reply: "質問内容が空です。機械学習で困っていることを入力してください。"
  });
}
```

---

### 2. Gemini APIへの送信処理

バックエンドでは、受け取った質問をGemini APIに送信している。

```js
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite"
});
```

ここでは、使用するGeminiのモデルを指定している。
本プロジェクトでは、軽量で扱いやすい `gemini-2.5-flash-lite` を使用した。

Gemini APIに送信する前に、AIの役割や回答ルールをプロンプトとして設定している。

```js
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
```

このようにプロンプトを設定することで、単に質問に答えるだけでなく、機械学習を学ぶ初学者向けに分かりやすく説明する回答になるよう工夫した。

その後、以下の処理でGemini APIに質問を送信している。

```js
const result = await model.generateContent(prompt);
const reply = result.response.text() || "回答を生成できませんでした。";
```

`generateContent()` にプロンプトを渡し、Gemini APIから返ってきた回答を `reply` として取得している。
この処理はAPI通信を行うため時間がかかる可能性があるので、`async` / `await` を使って回答が返るまで待つようにした。

---

### 3. チャット画面への表示処理

Gemini APIから回答が返ってきた後、バックエンドはフロントエンドへJSON形式で回答を返す。

```js
res.json({
  reply: reply
});
```

フロントエンド側では、返ってきたJSONを受け取り、回答内容を画面に表示している。

```js
const result = await response.json();

removeThinkingMessage();

addMessage("bot", result.reply);
```

`response.json()` によって、サーバーから返ってきたJSONデータをJavaScriptで使える形に変換している。
その後、`addMessage("bot", result.reply)` によって、AIの回答をチャット画面に追加している。

---

### 4. メッセージ追加処理

チャット画面にメッセージを追加する処理は、`addMessage()` 関数で行っている。

```js
function addMessage(type, text) {
  const chatBox = document.getElementById("chatBox");

  const div = document.createElement("div");

  div.classList.add("message");

  if (type === "user") {
    div.classList.add("user-message");
  } else {
    div.classList.add("bot-message");
  }

  div.textContent = text;

  chatBox.appendChild(div);
}
```

この関数では、新しい `div` 要素を作成し、ユーザーのメッセージかAIのメッセージかによってCSSクラスを切り替えている。
`user-message` の場合は右側、`bot-message` の場合は左側に表示されるようにCSSで設定した。

最後に、`appendChild()` を使って作成したメッセージをチャット欄に追加している。

---

### 5. 「考え中...」の表示処理

AIの回答が返ってくるまでの間、画面には一時的に「考え中...」と表示している。

```js
addMessage("bot", "考え中...");
```

回答が返ってきた後は、以下の関数で「考え中...」のメッセージを削除している。

```js
function removeThinkingMessage() {
  const messages = document.querySelectorAll(".bot-message");

  const lastMessage = messages[messages.length - 1];

  if (lastMessage && lastMessage.textContent === "考え中...") {
    lastMessage.remove();
  }
}
```

これにより、ユーザーはAIが処理中であることを視覚的に確認できる。
また、回答が返ってきた後には「考え中...」が残らないようにした。

---

### 6. 会話履歴の保存処理

Gemini APIから回答を取得した後、質問と回答を `history.json` に保存している。

```js
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
```

ここでは、まず既存の履歴を `loadHistory()` で読み込み、新しい質問と回答を `record` として追加している。
`id` には `Date.now()` を使用し、日時は日本時間で保存するようにした。

例として保存されるデータの形式は以下のようになる。

```json
{
  "id": 1710000000000,
  "date": "2026/6/4 12:00:00",
  "question": "機械学習とは何ですか？",
  "answer": "機械学習とは、データから規則性を学習する技術です。"
}
```

---

### 7. 履歴ファイルの作成・読み込み・保存

履歴を保存するために、`data/history.json` を使用している。
ファイルやフォルダが存在しない場合は、自動で作るようにした。

```js
function ensureHistoryFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, "[]", "utf-8");
  }
}
```

`loadHistory()` では、`history.json` を読み込み、JSON文字列をJavaScriptの配列に変換している。

```js
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
```

`saveHistory()` では、JavaScriptの配列をJSON形式に変換し、`history.json` に保存している。

```js
function saveHistory(history) {
  ensureHistoryFile();

  fs.writeFileSync(
    historyPath,
    JSON.stringify(history, null, 2),
    "utf-8"
  );
}
```

`JSON.stringify(history, null, 2)` とすることで、JSONファイルを見やすい形で保存している。

---

### 8. 学習履歴の表示処理

`outline.html` では、ページ読み込み時に `/history` へアクセスし、保存された会話履歴を取得している。

```js
const response = await fetch("/history");
const result = await response.json();
```

取得した履歴は、以下の処理で新しい順に表示している。

```js
result.history.slice().reverse().forEach(item => {
  const div = document.createElement("div");

  div.classList.add("history-item");

  div.innerHTML = `
    <p class="history-date">${escapeHtml(item.date)}</p>
    <p><strong>質問:</strong> ${escapeHtml(item.question)}</p>
    <p><strong>回答:</strong> ${escapeHtml(item.answer)}</p>
  `;

  historyBox.appendChild(div);
});
```

`slice().reverse()` を使うことで、元の履歴データを壊さずに、画面上では新しい履歴から表示できるようにした。

---

### 9. 学習内容の要約処理

`outline.html` で「学習内容を要約する」ボタンを押すと、`/summary` にアクセスする。

```js
const response = await fetch("/summary");
const result = await response.json();

summaryBox.textContent = result.summary;
```

バックエンドの `/summary` では、保存された履歴を読み込み、直近30件だけを要約対象にしている。

```js
const recentHistory = history.slice(-30);
```

履歴が多すぎるとGemini APIに送る文字数が増え、処理が重くなる可能性がある。
そのため、直近30件に限定することで、要約処理を安定させるようにした。

要約用のプロンプトでは、以下のように出力形式を指定している。

```text
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
```

これにより、単なる文章の要約ではなく、学習の振り返りとして使いやすい形式で出力されるようにした。

---

### 10. 履歴削除処理

学習まとめページでは、要約後に履歴を削除できるようにした。

```js
const ok = confirm("要約後の学習履歴を削除しますか？");

if (!ok) {
  return;
}
```

削除前に確認画面を表示し、ユーザーが承認した場合のみ削除処理を実行している。

```js
const response = await fetch("/clear-history", {
  method: "POST"
});
```

バックエンド側では、以下の処理で履歴を空にしている。

```js
app.post("/clear-history", (req, res) => {
  saveHistory([]);

  res.json({
    message: "学習履歴を削除しました。"
  });
});
```

`saveHistory([])` によって、`history.json` の中身を空の配列にしている。
ファイル自体は残し、中身だけを削除する仕組みにした。

---

### 11. HTMLエスケープ処理

履歴を画面に表示する際には、`escapeHtml()` を使用している。

```js
function escapeHtml(text) {
  if (!text) {
    return "";
  }

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
```

これは、ユーザーが入力した文字列がHTMLタグとして実行されないようにするための処理である。
例えば、`<script>` のような文字が入力された場合でも、HTMLとして実行されず、文字列として表示されるようにした。

---

### 12. APIキーの管理

Gemini APIキーは、コードに直接書かず、環境変数から取得している。

```js
const apiKey = process.env.GEMINI_API_KEY;
```

APIキーが設定されていない場合は、以下のようにエラーメッセージを表示するようにした。

```js
if (!apiKey) {
  console.log("GEMINI_API_KEY が設定されていません。RenderのEnvironment Variables または .env を確認してください。");
}
```

これにより、GitHubにコードを公開してもAPIキーが漏れないようにしている。
ローカル環境では `.env`、RenderではEnvironment VariablesにAPIキーを設定する。

---

### 13. エラー処理

API通信や履歴取得、要約処理では、`try-catch` を用いてエラー処理を行っている。

```js
try {
  const response = await fetch("/summary");

  if (!response.ok) {
    throw new Error("API error");
  }

  const result = await response.json();

  summaryBox.textContent = result.summary;

} catch (error) {
  console.error(error);

  summaryBox.textContent = "要約の取得に失敗しました。";
}
```

`response.ok` は、通信が成功したかどうかを表す値である。
通信に失敗した場合は `throw new Error()` でエラーとして扱い、`catch` の中でエラーメッセージを表示するようにした。

これにより、API制限や通信エラーが発生した場合でも、画面上に分かりやすいメッセージを表示できるようにした。

---

### 14. レスポンシブ対応

CSSでは、画面幅が600px以下の場合にスマートフォン向けの表示へ切り替えている。

```css
@media (max-width: 600px) {
  .header h1 {
    font-size: 22px;
  }

  .chat-area {
    height: 440px;
  }

  .input-area {
    flex-direction: column;
  }

  .message {
    max-width: 95%;
  }

  button,
  .link-button {
    width: 100%;
    text-align: center;
  }
}
```

PC画面では入力欄とボタンを横並びにし、スマートフォンでは縦並びにしている。
また、ボタンを画面幅いっぱいに表示することで、スマートフォンでも押しやすいようにした。

---

## 工夫した点

### 1. チャットだけで終わらず、学習内容を振り返れるようにした

本アプリでは、AIの回答を表示するだけでなく、質問と回答の内容をJSONファイルに保存している。
その履歴をもとにAIが学習内容を要約することで、ユーザーが後から自分の学習内容を振り返れるようにした。

これにより、単なる質問用チャットボットではなく、学習支援ツールとして使える形を目指した。

### 2. Gemini APIへの指示を学習支援向けに調整した

Gemini APIに送信するプロンプトでは、AIに対して「機械学習を学ぶ人向けの学習支援チャットボット」として回答するように指示している。

具体的には、専門用語をできるだけ簡単に説明すること、必要ならPythonや機械学習の具体例を入れること、質問者が自分で実装できるように考え方も説明することを指定した。

### 3. 直近30件のみを要約対象にした

学習履歴が増えすぎると、Gemini APIに送信する文字数が多くなり、処理が不安定になる可能性がある。
そのため、`history.slice(-30)` を用いて、直近30件の履歴だけを要約対象にした。

これにより、要約処理の負荷を抑えつつ、最近の学習内容を中心に振り返れるようにした。

### 4. APIキーを環境変数で管理した

Gemini APIのAPIキーは、コードに直接書かず、`.env` やRenderのEnvironment Variablesで管理するようにした。
これにより、GitHubにコードを公開する際にAPIキーが漏れないようにした。

### 5. レスポンシブ対応を行った

CSSでは、PC画面だけでなくスマートフォン画面でも見やすくなるように、`@media` を用いてレスポンシブ対応を行った。
画面幅が狭い場合は、入力欄とボタンを縦並びにし、ボタンも画面幅いっぱいに表示されるようにした。

### 6. 用途に応じてGeminiモデルを使い分けた

通常のチャット回答では、質問回数が多くなることを想定し、軽量な `gemini-2.5-flash-lite` を使用した。  
一方で、学習要約では、会話履歴から学習内容を整理する必要があるため、回答品質を重視して `gemini-2.5-flash` を使用した。

---

## 苦労した点

### 1. フロントエンドとバックエンドのつながり

最初は、HTMLで入力された内容がどのようにバックエンドへ送られ、どのようにAIの回答が画面に戻るのかを理解するのが難しかった。
特に、`fetch("/chat")`、`app.post("/chat")`、`req.body`、`res.json()` のつながりを理解する必要があった。

### 2. 非同期処理の理解

Gemini APIへの通信では、回答が返ってくるまでに時間がかかるため、`async` / `await` を使う必要があった。
この処理を理解することで、APIからの回答を待ってから画面に表示する流れを実装できた。

### 3. APIキーの管理

APIキーをコードに直接書くと、GitHubに公開した際に漏洩する危険がある。
そのため、`.env` やRenderの環境変数を利用し、APIキーを安全に管理する方法を学んだ。

### 4. エラー処理

APIキーが設定されていない場合や、Gemini APIの利用制限に達した場合、通信エラーが発生した場合などを考慮する必要があった。
そのため、`try-catch` や `response.ok` を使ってエラー時の処理を実装した。

---

## 学んだこと

この開発を通して、外部APIを利用したWebアプリケーションの基本的な構成を学ぶことができた。

特に、HTMLで入力された内容をJavaScriptで取得し、`fetch` を使ってバックエンドへ送信し、Express側で受け取ったデータをGemini APIに送信する一連の流れを理解できた。

また、AI APIを使うだけでなく、質問と回答のデータを保存し、後から活用できる形にすることで、AIを学習支援ツールとして応用する方法についても学ぶことができた。

本プロジェクトを通して、以下の知識を学んだ。

* JavaScriptの `fetch`、`async` / `await` を用いた非同期通信
* Expressの `app.get()`、`app.post()` によるルーティング
* `req.body` と `res.json()` を用いたJSON形式のデータ送受信
* Gemini APIの `generateContent()` を用いたAI回答生成
* Node.jsの `fs` モジュールを用いたJSONファイルの読み書き
* `.env` と環境変数によるAPIキー管理
* RenderでWebアプリを公開するためのポート設定

---

## 今後の課題

今後は、保存した質問と回答をより見やすく整理し、日付ごとや学習テーマごとに確認できるようにしたい。
現在はJSONファイルに履歴を保存しているが、履歴が増えると管理が難しくなるため、今後はデータベースを用いた管理にも挑戦したい。

また、現在は基本的なチャット機能と要約機能が中心であるため、今後はユーザーごとの学習履歴管理や、過去の質問内容をもとにした復習問題の作成機能も追加したい。

さらに、UIについてはAIの支援を受けながら作成した部分があるため、今後はCSSの理解を深め、自分でデザインや画面構成を調整できるようにしたい。

---

## 起動方法

### 1. パッケージのインストール

```bash
npm install
```

### 2. `.env` ファイルの作成

プロジェクト直下に `.env` ファイルを作成し、以下のようにGemini APIキーを設定する。

```env
GEMINI_API_KEY=自分のAPIキー
```

### 3. サーバー起動

```bash
npm start
```

または、以下のコマンドで起動する。

```bash
node server.js
```

### 4. ブラウザでアクセス

```text
http://localhost:3000
```

---

## 環境変数

本アプリでは、Gemini APIキーを環境変数で管理している。

```env
GEMINI_API_KEY=自分のAPIキー
```

GitHubに公開する際は、`.env` ファイルを `.gitignore` に追加し、APIキーが公開されないようにする。

---

## 参考文献

本プロジェクトでは、JavaScriptによる非同期通信、Expressを用いたサーバー構築、Gemini APIの利用方法を学ぶために、以下のサイトを参考にした。

### JavaScriptにおける `fetch`、`async` / `await` の使い方

https://qiita.com/teru_dev/items/beffdb3b378acec73520

フロントエンドからバックエンドへリクエストを送信し、レスポンスを受け取る処理を理解するために参考にした。
特に、`fetch()` を使ったAPI通信や、`async` / `await` を用いて非同期処理を扱う方法の理解に活用した。

### Expressの使い方

https://qiita.com/ryome/items/16659012ed8aa0aa1fac

Node.jsでWebサーバーを作成する方法を理解するために参考にした。
特に、`app.get()`、`app.post()`、`express.json()` など、Expressを用いたルーティングやJSONデータの受け取り方を学ぶ際に活用した。

### Gemini APIをNode.jsから利用する方法

https://qiita.com/beerhusky/items/5f4dde826c793033708e

Node.jsからGemini APIを呼び出し、AIの回答を取得する方法を学ぶために参考にした。
特に、Gemini APIのモデル指定や、`generateContent()` を用いた回答生成処理の理解に活用した。

### Gemini APIとNode.js / Expressを用いた開発方法

https://qiita.com/automation2025/items/ef3b77d453724b3ebaa9

ExpressサーバーからGemini APIを利用する構成を理解するために参考にした。
特に、APIキーを環境変数で管理する方法や、バックエンド側でAI APIを呼び出す流れを学ぶ際に活用した。
