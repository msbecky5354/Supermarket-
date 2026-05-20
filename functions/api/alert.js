// functions/api/alert.js (Cloudflare Pages 專用版)

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const codes = body.codes;
        
        if (!codes) {
            return new Response(JSON.stringify({ error: 'No codes provided' }), { status: 400 });
        }

        // 喺 Cloudflare 夾萬拎密碼 (寫法同 Vercel 唔同，要用 env.XXX)
        const botToken = env.TG_BOT_TOKEN;
        const chatId = env.TG_CHAT_ID;

        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const messageText = `🚨 價格神器警報 (Cloudflare版) 🚨\n發現未翻譯嘅超市代碼：${codes}\n老細，得閒記得去更新 lang.js 啦！😎`;

        await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: chatId, 
                text: messageText 
            })
        });

        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to send alert' }), { status: 500 });
    }
}