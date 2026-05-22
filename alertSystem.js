// alertSystem.js - 慳真D🔎 純前端到價提醒系統 (零個資版)

// 取得產品當前最低折實價的 Helper 函數
function getCurrentMinPrice(pName) {
    if (!window.structuredData) return null;
    for (let cat1 in window.structuredData) {
        for (let cat2 in window.structuredData[cat1]) {
            if (window.structuredData[cat1][cat2][pName]) {
                const info = window.structuredData[cat1][cat2][pName];
                let validPrices = [];
                info.prices.forEach(p => {
                    let parsed = parseFloat(p.price);
                    if (!isNaN(parsed)) {
                        let avg = window.calculateAvgPrice ? window.calculateAvgPrice(p.promoCalc, parsed) : parsed;
                        validPrices.push((avg && avg > 0 && avg < parsed) ? avg : parsed);
                    }
                });
                return validPrices.length > 0 ? Math.min(...validPrices) : null;
            }
        }
    }
    return null;
}

// 1. 打開設定心水價彈窗
function openAlertModal(pName, currentMinPrice) {
    let modal = document.getElementById('priceAlertModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'priceAlertModal';
        modal.className = 'fixed inset-0 bg-slate-900/40 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col transform scale-95 transition-transform duration-300" id="priceAlertBox">
                <div class="flex justify-between items-center mb-4 border-b pb-3 border-slate-100">
                    <h3 class="text-[17px] font-black text-slate-800 flex items-center gap-2"><span class="text-amber-500">🔔</span> 設定到價提醒</h3>
                    <button onclick="closeAlertModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold active:scale-90 transition">✕</button>
                </div>
                <p class="text-[14px] text-slate-700 mb-2 font-black leading-tight" id="alertProductName"></p>
                <p class="text-[12px] text-slate-500 mb-4">目前最抵折實價：<span id="alertCurrentPrice" class="font-bold text-blue-600 text-[14px]"></span></p>
                
                <div class="mb-5">
                    <label class="block text-[12px] font-bold text-slate-500 mb-1.5">當跌穿以下心水價 (HK$) 時提醒我：</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input type="number" id="targetPriceInput" step="0.1" class="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 font-black text-[18px] text-slate-800 transition-all shadow-sm inset-y-0">
                    </div>
                </div>
                
                <div class="bg-emerald-50 p-3 rounded-xl mb-5 border border-emerald-100 flex gap-2 items-start">
                    <span class="text-[14px]">🛡️</span>
                    <p class="text-[11px] text-emerald-700 leading-relaxed font-medium mt-0.5"><b>私隱保證：</b>本功能採用離線運算技術，追蹤清單只會存在你的手機瀏覽器內，絕對不會收集任何個人資料。</p>
                </div>
                
                <button onclick="saveAlert()" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-all shadow-md shadow-amber-200/50 text-[15px]">
                    加入追蹤清單
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('alertProductName').innerText = pName;
    document.getElementById('alertCurrentPrice').innerText = `$${currentMinPrice}`;
    // 預設幫用戶打個9折做心水價
    let suggestedPrice = parseFloat(currentMinPrice) * 0.9;
    document.getElementById('targetPriceInput').value = suggestedPrice.toFixed(1); 
    
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

// 2. 儲存設定到 localStorage
function saveAlert() {
    const pName = document.getElementById('alertProductName').innerText;
    const targetPrice = parseFloat(document.getElementById('targetPriceInput').value);
    
    if (isNaN(targetPrice) || targetPrice <= 0) {
        alert("請輸入有效的心水價！"); return;
    }

    let myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    myAlerts[pName] = { 
        targetPrice: targetPrice, 
        dateAdded: new Date().getTime() 
    };
    localStorage.setItem('hk_price_alerts', JSON.stringify(myAlerts));

    closeAlertModal();
    if(typeof showToast === 'function') showToast(); // 借用你 index.html 嘅 toast
    updateAlertBadge();
}

function removeAlert(pName) {
    let myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    delete myAlerts[pName];
    localStorage.setItem('hk_price_alerts', JSON.stringify(myAlerts));
    openMyAlerts(); // 重新整理清單
    updateAlertBadge();
}

// 3. 更新 Header 嘅通知紅點狀態
function updateAlertBadge() {
    const myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    const badge = document.getElementById('alertBadge');
    if (!badge) return;

    const alertKeys = Object.keys(myAlerts);
    if (alertKeys.length === 0) {
        badge.classList.add('hidden');
        return;
    }

    badge.classList.remove('hidden');
    
    // 檢查有冇貨品已經跌穿心水價
    let hasReachedTarget = false;
    for (let pName of alertKeys) {
        let currentPrice = getCurrentMinPrice(pName);
        if (currentPrice !== null && currentPrice <= myAlerts[pName].targetPrice) {
            hasReachedTarget = true;
            break;
        }
    }

    // 如果中咗獎，紅點閃爍 + 變紅色；未中獎就淺灰色提示有追蹤
    if (hasReachedTarget) {
        badge.className = "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse";
    } else {
        badge.className = "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-300 border-2 border-white rounded-full";
    }
}

// 4. 打開「我的追蹤」通知中心
function openMyAlerts() {
    let modal = document.getElementById('myAlertsListModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'myAlertsListModal';
        modal.className = 'fixed inset-0 bg-slate-900/40 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        document.body.appendChild(modal);
    }

    const myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    const alertKeys = Object.keys(myAlerts);
    
    let listHtml = '';
    if (alertKeys.length === 0) {
        listHtml = `<div class="text-center py-10 text-slate-400 text-[13px]"><span class="text-3xl block mb-2">📭</span>你尚未追蹤任何貨品。<br>喺產品卡片撳 🔔 就可以加入追蹤！</div>`;
    } else {
        listHtml = alertKeys.map(pName => {
            let data = myAlerts[pName];
            let currentPrice = getCurrentMinPrice(pName);
            let isHit = currentPrice !== null && currentPrice <= data.targetPrice;
            
            let statusBadge = isHit 
                ? `<span class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold animate-pulse shadow-sm">到價！而家 $${currentPrice.toFixed(1)}</span>`
                : `<span class="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-md font-bold">現價: $${currentPrice !== null ? currentPrice.toFixed(1) : '--'}</span>`;

            let bgClass = isHit ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-100';

            return `
            <div class="p-3 rounded-2xl border ${bgClass} shadow-sm flex items-center justify-between gap-3 transition-all relative overflow-hidden">
                <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-black text-slate-700 leading-tight mb-1">${pName}</div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[11px] text-slate-500 font-medium">心水價: <b class="text-slate-700">$${data.targetPrice}</b></span>
                        ${statusBadge}
                    </div>
                </div>
                <button onclick="removeAlert('${pName}')" class="w-7 h-7 flex-none flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-red-500 active:scale-90 transition">✕</button>
            </div>
            `;
        }).join('');
    }

    modal.innerHTML = `
        <div class="bg-slate-50 rounded-3xl max-w-sm w-full shadow-2xl flex flex-col transform scale-95 transition-transform duration-300 max-h-[85vh]" id="myAlertsListBox">
            <div class="bg-white rounded-t-3xl px-5 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 class="text-[16px] font-black text-slate-800 flex items-center gap-2"><span class="text-rose-500">🔔</span> 我的追蹤清單</h3>
                <button onclick="closeMyAlerts()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold active:scale-90 transition">✕</button>
            </div>
            
            <div class="overflow-y-auto p-4 space-y-3 no-scrollbar flex-1">
                ${listHtml}
            </div>
            
            <div class="bg-white rounded-b-3xl p-4 border-t border-slate-100 shrink-0">
                <button onclick="closeMyAlerts()" class="w-full bg-slate-800 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition shadow-md text-[14px]">
                    關閉
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('myAlertsListBox').classList.remove('scale-95');
    }, 10);
}

function closeMyAlerts() {
    const modal = document.getElementById('myAlertsListModal');
    if(modal) {
        modal.classList.add('opacity-0');
        document.getElementById('myAlertsListBox').classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}