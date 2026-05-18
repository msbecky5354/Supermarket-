// promoEngine.js - 100% 純英文運算大腦版 (已清除所有中文過濾)

// 💡 搜尋強化：移除非字母、數字及中文字元 (呢個保留中文係因為用家搜尋時會打中文)
function normalizeStr(str) {
    if (!str) return "";
    return String(str)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "") 
        .toLowerCase();
}

// 💡 深度遞迴掃描器
function extractDeepPromoText(val, targetLang) {
    if (!val) return "";
    if (typeof val === 'string') return val.trim();
    if (Array.isArray(val)) return val.map(v => extractDeepPromoText(v, targetLang)).filter(v => v !== "").join('; ');
    
    if (typeof val === 'object') {
        if (val[targetLang]) return extractDeepPromoText(val[targetLang], targetLang);
        // 修正：如果系統指明要抽 'en'，就絕對唔會 Fallback 去 'zh-Hant'
        if (targetLang !== 'en' && val['zh-Hant']) return extractDeepPromoText(val['zh-Hant'], targetLang);
        if (val.description) return extractDeepPromoText(val.description, targetLang);
        let vals = Object.values(val);
        if (vals.length > 0) return extractDeepPromoText(vals[0], targetLang);
    }
    return String(val);
}

// 🧠 100% 純英文無死角引擎
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return null;
    try {
        // 清理多餘空格，全部轉細楷
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        
        // 1. Buy X save Y (e.g., "Buy 2 item(s) save $27.00")
        let mSave = p.match(/buy.*?([0-9]+).*?save.*?\$?([0-9.]+)/);
        if (mSave) return ((originalPrice * parseInt(mSave[1])) - parseFloat(mSave[2])) / parseInt(mSave[1]);
        
        // 2. Buy Second for $X (e.g., "Buy Second for $1.00")
        let m2ndFor = p.match(/(?:buy\s*)?(?:second|2nd).*?for\s*\$([0-9.]+)/);
        if (m2ndFor) return (originalPrice + parseFloat(m2ndFor[1])) / 2;

        // 3. X for $Y / Buy X for $Y / X at $Y (e.g., "2 for $16.00", "Buy 2 at $54.00")
        let mFor1 = p.match(/([0-9]+).*?(?:for|at)\s*\$([0-9.]+)/);
        if (mFor1 && !p.includes('save')) return parseFloat(mFor1[2]) / parseInt(mFor1[1]);
        
        // 4. 2nd Item % off (e.g., "2nd item for 50% off", "50% for 2nd")
        let m2ndPerc = p.match(/(?:2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:2nd)/);
        if (m2ndPerc) {
            let perc = parseFloat(m2ndPerc[1] || m2ndPerc[2]);
            return (originalPrice * (2 - (perc / 100))) / 2;
        }

        // 5. % off (e.g., "15% off")
        let mPerc = p.match(/([0-9.]+)%\s*off/);
        if (mPerc) return originalPrice * (1 - (parseFloat(mPerc[1]) / 100));

        // 6. Buy/Add X get Y free (e.g., "Add 2 item(s) to cart and get 1 free")
        let mFree = p.match(/(?:buy|add).*?([0-9]+).*?(?:get|free).*?([0-9]+)/);
        if (mFree) {
            let buy = parseInt(mFree[1]);
            let free = parseInt(mFree[2]);
            return (originalPrice * buy) / (buy + free);
        }

        // 7. Half price (e.g., "2nd half price")
        if (p.includes('half')) return (originalPrice * 1.5) / 2;

        return null;
    } catch(e) { return null; }
}
