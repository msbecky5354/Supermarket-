// sw.js - 負責喺背景接收 Push 訊號並彈出通知

self.addEventListener('push', function(event) {
    if (!event.data) return;

    // 解析由 Vercel 後台傳過嚟嘅 JSON 數據
    const data = event.data.json();
    
    const options = {
        body: `跌到 $${data.currentPrice} 啦！平過你設定嘅心水價 $${data.targetPrice}。`,
        icon: '/logo.JPG',
        badge: '/logo.JPG',
        vibrate: [200, 100, 200], // 震動節奏
        data: {
            url: data.url || '/' // 用戶撳通知嗰陣，彈去邊個版面
        }
    };

    // 指揮手機 OS 彈出原生通知
    event.waitUntil(
        self.registration.showNotification(`慳真D🔎：${data.productName} 降價！`, options)
    );
});

// 當用戶點擊通知時嘅行為
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // 如果已經開緊 App，就 focus 過去；否則開個新 Tab
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === '/' && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(event.notification.data.url);
        })
    );
});