// api/cron-alert.js
const webpush = require('web-push');

// 呢度要 Set 返你嘅 VAPID Keys (稍後教你點整)
webpush.setVapidDetails(
    'mailto:your-email@example.com', 
    process.env.VAPID_PUBLIC_KEY, 
    process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
    // 安全機制：只允許 GET 請求 (由 Vercel Cron Jobs 觸發)
    if (req.method !== 'GET') return res.status(405).end();

    try {
        // 1. 去消委會拎最新鮮嘅數據
        const priceRes = await fetch('https://online-price-watch.consumer.org.hk/opw/opendata/pricewatch.json');
        const latestData = await priceRes.json();
        
        // 2. 從你嘅 Database 拎返所有用戶嘅「匿名訂閱 Token」同「目標價」
        // (老細注意：Vercel Serverless 需要一個簡單 Database 存 Token，例如 Vercel KV)
        // 假設我哋由 DB 拎到呢個 Array:
        const subscriptions = await getSubscriptionsFromYourDB(); 

        let notificationsSent = 0;

        // 3. 格價邏輯
        for (const sub of subscriptions) {
            // 去 latestData 度搵返 sub.productName 依家最平賣幾錢 (連優惠計)
            let currentBestPrice = findCheapestPrice(latestData, sub.productName);
            
            // 4. 到價就發射！
            if (currentBestPrice > 0 && currentBestPrice <= sub.targetPrice) {
                const payload = JSON.stringify({
                    productName: sub.productName,
                    currentPrice: currentBestPrice,
                    targetPrice: sub.targetPrice,
                    url: "/"
                });

                await webpush.sendNotification(sub.subscriptionObject, payload);
                notificationsSent++;
                
                // 發送完可以喺 DB 刪除呢個 Alert，免得日日彈
                await removeSubscriptionFromYourDB(sub.id);
            }
        }

        res.status(200).json({ success: true, sent: notificationsSent });
    } catch (error) {
        console.error("Cron Job Error:", error);
        res.status(500).json({ error: error.message });
    }
}

// Helper: 假想嘅 Database 讀取函數 (你要連去 Vercel KV 或者 Firebase)
async function getSubscriptionsFromYourDB() { return []; }
async function removeSubscriptionFromYourDB(id) { return true; }
function findCheapestPrice(data, pName) { return 0; /* 呢度要套用你嘅 promoEngine 運算 */ }