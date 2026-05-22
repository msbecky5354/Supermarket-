// alertSystem.js - 慳真D🔎 零個資到價提醒系統

const VAPID_PUBLIC_KEY = '請稍後換成你嘅_VAPID_PUBLIC_KEY'; // 稍後教你點拎

// 1. 打開設定心水價彈窗
function openAlertModal(pName, currentMinPrice) {
    let modal = document.getElementById('priceAlertModal');
    if (!modal) {
        // 如果畫面未有呢個 Modal，動態生一個出嚟，保持 index.html 乾淨
        modal = document.createElement('div');
        modal.id = 'priceAlertModal';
        modal.className = 'fixed inset-0 bg-slate-900/40 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col transform scale-95 transition-transform duration-300" id="priceAlertBox">
                <div class="flex justify-between items-center mb-4 border-b pb-3 border-slate-100">
                    <h3 class="text-[17px] font-black text-slate-800 flex items-center gap-2"><span class="text-amber-500">🔔</span> 設定到價提醒</h3>
                    <button onclick="closeAlertModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold active:scale-90 transition">✕</button>
                </div>
                <p class="text-[13px] text-slate-600 mb-2 font-bold" id="alertProductName"></p>
                <p class="text-[11px] text-slate-400 mb-4">目前最抵折實價：<span id="alertCurrentPrice" class="font-bold text-slate-700"></span></p>
                
                <div class="mb-5">
                    <label class="block text-[12px] font-bold text-slate-700 mb-1">目標心水價 (HK$)</label>
                    <input type="number" id="targetPriceInput" step="0.1" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 font-bold text-[16px]">
                </div>
                
                <div class="bg-blue-50 p-3 rounded-xl mb-4 border border-blue-100">
                    <p class="text-[10px] text-blue-700 leading-relaxed">🔒 <b>私隱保證：</b>本功能採用瀏覽器匿名推送技術，絕對唔會收集或儲存你的電話或 Email 等個人資料。</p>
                </div>
                
                <button onclick="saveAlert()" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all shadow-md shadow-amber-200">
                    訂閱降價通知
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // 填入資料並顯示
    document.getElementById('alertProductName').innerText = pName;
    document.getElementById('alertCurrentPrice').innerText = `$${currentMinPrice}`;
    document.getElementById('targetPriceInput').value = (currentMinPrice * 0.9).toFixed(1); // 預設打9折做目標
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('priceAlertBox').classList.remove('scale-95');
    }, 10);
}

function closeAlertModal() {
    const modal = document.getElementById('priceAlertModal');
    if(modal) {
        modal.classList.add('opacity-0');
        document.getElementById('priceAlertBox').classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

// 2. 儲存設定並要求通知權限
async function saveAlert() {
    const pName = document.getElementById('alertProductName').innerText;
    const targetPrice = parseFloat(document.getElementById('targetPriceInput').value);
    
    if (isNaN(targetPrice) || targetPrice <= 0) {
        alert("請輸入有效的心水價！"); return;
    }

    // 將設定儲存到 Browser 嘅 localStorage
    let myAlerts = JSON.parse(localStorage.getItem('my_price_alerts') || '{}');
    myAlerts[pName] = { targetPrice: targetPrice, dateAdded: new Date().toISOString() };
    localStorage.setItem('my_price_alerts', JSON.stringify(myAlerts));

    closeAlertModal();
    
    // 註冊 Web Push
    try {
        await subscribeToPush(pName, targetPrice);
        showToast("✅ 已成功設定到價提醒！");
        updateAlertBadge();
    } catch (e) {
        console.error("Push subscription failed", e);
        showToast("⚠️ 已存入本地，但未開啟瀏覽器通知權限。");
    }
}

// 3. Web Push 核心邏輯
async function subscribeToPush(pName, targetPrice) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    
    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: VAPID_PUBLIC_KEY // 將 String 轉 Uint8Array 嘅過程省略以簡化，需用 urlBase64ToUint8Array
        });
        
        // 將匿名 Token 同心水價飛去 Vercel API 記低
        await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subscription: subscription, 
                productName: pName, 
                targetPrice: targetPrice 
            })
        });
    }
}

function updateAlertBadge() {
    let myAlerts = JSON.parse(localStorage.getItem('my_price_alerts') || '{}');
    const badge = document.getElementById('alertBadge');
    if(badge) {
        if(Object.keys(myAlerts).length > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
}

// 開 App 嗰陣 Check 下有幾多個 Alert
document.addEventListener("DOMContentLoaded", updateAlertBadge);