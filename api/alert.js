// api/alert.js (呢個係 Vercel 專用嘅隱藏後台)

export default async function handler(req, res) {
    // 只接受 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { codes } = req.body;
    if (!codes) {
        return res.status(400).json({ error: 'No codes provided' });
    }

    // 喺 Vercel 夾萬拎返密碼出嚟 (前端絕對睇唔到)
    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const messageText = `🚨 價格神器警報 🚨\n發現未翻譯嘅超市代碼：${codes}\n老細，得閒記得去更新 lang.js 啦！😎`;

    try {
        await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: chatId, 
                text: messageText 
            })
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send alert' });
    }
}