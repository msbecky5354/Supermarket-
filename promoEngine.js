// promoEngine.js - 神器專屬運算大腦 (100% 英文覆蓋版)

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
        if (val['zh-Hant']) return extractDeepPromoText(val['zh-Hant'], targetLang);
        if (val.description) return extractDeepPromoText(val.description, targetLang);
        let vals = Object.values(val);
        if (vals.length > 0) return extractDeepPromoText(vals[0], targetLang);
    }
    return String(val);
}

// 🧠 中英無死角終極引擎
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return null;
    try {
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        p = p.replace(/一/g, '1').replace(/二/g, '2').replace(/三/g, '3').replace(/兩/g, '2');
        
        // 1. Buy X save Y / 買 X 慳 Y
        let mSave = p.match(/(?:buy|買)?.*?([0-9]+).*?(?:save|慳).*?\$?([0-9.]+)/);
        if (mSave) return ((originalPrice * parseInt(mSave[1])) - parseFloat(mSave[2])) / parseInt(mSave[1]);
        
        // 🌟 2. Buy Second for $X (修復全場唯一漏網之魚)
        let m2ndFor = p.match(/(?:buy\s*)?(?:second|2nd).*?for\s*\$([0-9.]+)/);
        if (m2ndFor) return (originalPrice + parseFloat(m2ndFor[1])) / 2;

        // 3. X for $Y / Buy X for $Y
        let mFor1 = p.match(/([0-9]+).*?(?:for|at)\s*\$([0-9.]+)/);
        if (mFor1) return parseFloat(mFor1[2]) / parseInt(mFor1[1]);
        
        // 4. $Y 任揀 X 件
        let mFor2 = p.match(/\$?([0-9.]+).*?(?:任[揀擇買選])([0-9]+)/);
        if (mFor2) return parseFloat(mFor2[1]) / parseInt(mFor2[2]);

        // 5. 買 X件 $Y
        let mFor3 = p.match(/(?:買)?([0-9]+)[件包盒排支罐筒樽杯].*?\$([0-9.]+)/);
        if (mFor3 && !p.includes('save') && !p.includes('慳')) return parseFloat(mFor3[2]) / parseInt(mFor3[1]);

        // 6. 2nd Item % off / 第二件半價 (防禦屈臣氏/萬寧伏位)
        let m2ndPerc = p.match(/(?:2nd|第二).*?([0-9.]+)%|([0-9.]+)%.*?(?:2nd|第二)/);
        if (m2ndPerc) {
            let perc = parseFloat(m2ndPerc[1] || m2ndPerc[2]);
            return (originalPrice * (2 - (perc / 100))) / 2;
        }

        // 7. % off / 折扣
        let mPerc = p.match(/([0-9.]+)%\s*(?:off|折扣)/);
        if (mPerc) return originalPrice * (1 - (parseFloat(mPerc[1]) / 100));

        // 8. 打折
        let mDisc = p.match(/([0-9.]+)(?:折)/);
        if (mDisc) {
            let val = parseFloat(mDisc[1]);
            return originalPrice * (val >= 10 ? val / 100 : val / 10);
        }

        // 🌟 9. Buy/Add X get Y free (修復 Add 2 item(s) to cart and get 1 free)
        let mFree = p.match(/(?:buy|add|買).*?([0-9]+).*?(?:get|送|free).*?([0-9]+)/);
        if (mFree) {
            let buy = parseInt(mFree[1]);
            let free = parseInt(mFree[2]);
            return (originalPrice * buy) / (buy + free);
        }

        // 10. Half price / 半價
        if (p.includes('half') || p.includes('半價') || p.includes('半价')) return (originalPrice * 1.5) / 2;

        return null;
    } catch(e) { return null; }
}
