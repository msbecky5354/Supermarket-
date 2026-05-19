// promoEngine.js - 100% 純英文 (Safari/iOS 防彈兼容版)

// 💡 搜尋強化：移除非字母、數字及中文字元
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
        if (targetLang !== 'en' && val['zh-Hant']) return extractDeepPromoText(val['zh-Hant'], targetLang);
        if (val.description) return extractDeepPromoText(val.description, targetLang);
        let vals = Object.values(val);
        if (vals.length > 0) return extractDeepPromoText(vals[0], targetLang);
    }
    return String(val);
}

// 🧠 層級優先度計算引擎 (安全兼容版)
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return null;
    try {
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        const getNum = (n) => parseFloat(n);
        
        // 記錄係咪針對「第二件」
        const is2nd = p.includes('2nd') || p.includes('second');
        
        // ==========================================
        // 級別 1：最複雜嘅「買 X 送 Y」及「特定 Y 折扣」
        // ==========================================
        let mGetFor = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+).*?(?:for|at)\s*\$([0-9.]+)/);
        if (mGetFor) return (originalPrice * getNum(mGetFor[1]) + getNum(mGetFor[3])) / (getNum(mGetFor[1]) + getNum(mGetFor[2]));

        let mGetHalf = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+).*?half/);
        if (mGetHalf) return (originalPrice * getNum(mGetHalf[1]) + (originalPrice * 0.5 * getNum(mGetHalf[2]))) / (getNum(mGetHalf[1]) + getNum(mGetHalf[2]));

        // 🔥 修正版：加入 [^\d]+ 強制分隔數量同折數，防止好似 "15" 咁被硬拆做 "1" 和 "5"
        let mGetPerc = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+)[^\d]+([0-9.]+)%\s*off/);
        if (mGetPerc) return (originalPrice * getNum(mGetPerc[1]) + (originalPrice * (1 - getNum(mGetPerc[3])/100) * getNum(mGetPerc[2]))) / (getNum(mGetPerc[1]) + getNum(mGetPerc[2]));

        let mGetFree = p.match(/(?:buy|add).*?([0-9]+).*?(?:get|free).*?([0-9]+)/);
        if (mGetFree) return (originalPrice * getNum(mGetFree[1])) / (getNum(mGetFree[1]) + getNum(mGetFree[2]));

        // ==========================================
        // 級別 2：「第二件 (2nd / Second)」專屬處理
        // ==========================================
        let m2ndFor = p.match(/(?:second|2nd).*?(?:for|at)\s*\$([0-9.]+)/);
        if (m2ndFor) return (originalPrice + getNum(m2ndFor[1])) / 2;

        if (p.match(/(?:second|2nd).*?half/)) return (originalPrice * 1.5) / 2;

        let m2ndPerc = p.match(/(?:second|2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:second|2nd)/);
        if (m2ndPerc) return (originalPrice * (2 - (getNum(m2ndPerc[1] || m2ndPerc[2]) / 100))) / 2;

        // ==========================================
        // 級別 3：常規數量計算 (Buy X save Y / X for $Y)
        // ==========================================
        let mSave = p.match(/(?:buy|add).*?([0-9]+).*?save.*?\$([0-9.]+)/);
        if (mSave) return (originalPrice * getNum(mSave[1]) - getNum(mSave[2])) / getNum(mSave[1]);

        // 最基本嘅 X for $Y (確保唔係第二件專屬)
        let mFor = p.match(/([0-9]+).*?(?:for|at)\s*\$([0-9.]+)/);
        if (mFor && !is2nd) return getNum(mFor[2]) / getNum(mFor[1]);

        // ==========================================
        // 級別 4：全單折扣 (Overall % off / Half price)
        // ==========================================
        // 依家 "Buy 2 to get 15% off" 會安全跌落嚟呢度，精準計出 15% off 嘅折合單價
        let mPerc = p.match(/([0-9.]+)%\s*off/);
        if (mPerc && !is2nd) return originalPrice * (1 - (getNum(mPerc[1]) / 100));

        if (p.includes('half price') && !is2nd) return originalPrice * 0.5;

        return null;
    } catch(e) { 
        console.error("Promo Engine Error:", e);
        return null; 
    }
}
