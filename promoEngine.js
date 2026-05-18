// promoEngine.js - 100% 純英文 (嚴謹階級防漏版)

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

// 🧠 層級優先度計算引擎 (Tiered Priority Logic)
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return null;
    try {
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        const getNum = (n) => parseFloat(n);
        
        // ==========================================
        // 級別 1：最複雜嘅「買 X 送 Y」及「特定 Y 折扣」
        // ==========================================
        
        // 1a. Buy X get Y for $Z (e.g., "Buy 1 get 1 for $10.00")
        let mGetFor = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+).*?(?:for|at)\s*\$([0-9.]+)/);
        if (mGetFor) return (originalPrice * getNum(mGetFor[1]) + getNum(mGetFor[3])) / (getNum(mGetFor[1]) + getNum(mGetFor[2]));

        // 1b. Buy X get Y half price (e.g., "Buy 1 get 1 half price")
        let mGetHalf = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+).*?half/);
        if (mGetHalf) return (originalPrice * getNum(mGetHalf[1]) + (originalPrice * 0.5 * getNum(mGetHalf[2]))) / (getNum(mGetHalf[1]) + getNum(mGetHalf[2]));

        // 1c. Buy X get Y Z% off (e.g., "Buy 2 get 1 50% off")
        let mGetPerc = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+).*?([0-9.]+)%\s*off/);
        if (mGetPerc) return (originalPrice * getNum(mGetPerc[1]) + (originalPrice * (1 - getNum(mGetPerc[3])/100) * getNum(mGetPerc[2]))) / (getNum(mGetPerc[1]) + getNum(mGetPerc[2]));

        // 1d. Buy X get Y free (嚴格限制必須有 free)
        let mGetFree = p.match(/(?:buy|add).*?([0-9]+).*?get.*?([0-9]+).*?free/);
        if (mGetFree) return (originalPrice * getNum(mGetFree[1])) / (getNum(mGetFree[1]) + getNum(mGetFree[2]));

        // ==========================================
        // 級別 2：「第二件 (2nd / Second)」專屬處理
        // ==========================================
        
        // 2a. 2nd for $Z (e.g., "Buy 2nd for $10.00")
        let m2ndFor = p.match(/(?:second|2nd).*?(?:for|at)\s*\$([0-9.]+)/);
        if (m2ndFor) return (originalPrice + getNum(m2ndFor[1])) / 2;

        // 2b. 2nd half price (e.g., "2nd item half price")
        if (p.match(/(?:second|2nd).*?half/)) return (originalPrice * 1.5) / 2;

        // 2c. 2nd Z% off (e.g., "50% off for 2nd")
        let m2ndPerc = p.match(/(?:second|2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:second|2nd)/);
        if (m2ndPerc) return (originalPrice * (2 - (getNum(m2ndPerc[1] || m2ndPerc[2]) / 100))) / 2;

        // ==========================================
        // 級別 3：常規數量計算 (Buy X save Y / X for $Y)
        // ==========================================
        
        // 3a. Buy X save $Y
        let mSave = p.match(/(?:buy|add).*?([0-9]+).*?save.*?\$([0-9.]+)/);
        if (mSave) return (originalPrice * getNum(mSave[1]) - getNum(mSave[2])) / getNum(mSave[1]);

        // 3b. X for $Y / Buy X at $Y (排到最後先執行，避免誤傷)
        // 嚴格確保前面唔係 "2nd"
        let mFor = p.match(/(?<!(?:2nd|second)\s*.*?)([0-9]+).*?(?:for|at)\s*\$([0-9.]+)/);
        if (mFor) return getNum(mFor[2]) / getNum(mFor[1]);

        // ==========================================
        // 級別 4：全單折扣 (Overall % off / Half price)
        // ==========================================
        
        // 4a. Overall % off (e.g., "15% off")
        let mPerc = p.match(/([0-9.]+)%\s*off/);
        if (mPerc) return originalPrice * (1 - (getNum(mPerc[1]) / 100));

        // 4b. Overall half price (排除咗 2nd)
        if (p.includes('half price')) return originalPrice * 0.5;

        return null;
    } catch(e) { return null; }
}
