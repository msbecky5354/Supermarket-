// promoEngine.js - 100% 純英文 (Safari/iOS 突破攔截版 + Google Sheet 收集器)

// 📡 未知優惠收集器 (隱藏原生 HTML Form 絕招 - 100% 突破 iOS 限制)
function logUnknownPromo(promoText, originalPrice, calculatedPrice) {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe7oOQ-7klgKPvjgRof2_Ztae1fBMWuA0_us32ewkK8TbbxbA/formResponse';
    
    let iframeName = 'hidden_iframe_' + Math.random().toString(36).substring(7);
    let iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let form = document.createElement('form');
    form.method = 'POST';
    form.action = formUrl;
    form.target = iframeName; 
    form.style.display = 'none';

    let data = {
        'entry.1839150021': promoText,
        'entry.1121303872': String(originalPrice),
        'entry.1938861444': calculatedPrice !== null ? calculatedPrice.toFixed(2) : 'null'
    };

    for (let key in data) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    
    console.log('✅ 已用原生 Form 絕招強行發送資料至 Google Sheet！');

    setTimeout(() => {
        if (document.body.contains(form)) document.body.removeChild(form);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 2000);
}

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

// 🧠 層級優先度計算引擎
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return null;
    
    let finalPrice = null;
    
    try {
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        const getNum = (n) => parseFloat(n);
        const is2nd = p.includes('2nd') || p.includes('second');
        
        let mGetFor = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?(?:for|at)\s*\$([0-9.]+)/);
        if (mGetFor) finalPrice = (originalPrice * getNum(mGetFor[1]) + getNum(mGetFor[3])) / (getNum(mGetFor[1]) + getNum(mGetFor[2]));

        else {
            let mGetHalf = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?half/);
            if (mGetHalf) finalPrice = (originalPrice * getNum(mGetHalf[1]) + (originalPrice * 0.5 * getNum(mGetHalf[2]))) / (getNum(mGetHalf[1]) + getNum(mGetHalf[2]));

            else {
                let mGetPerc = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b\s+([0-9.]+)%\s*off/);
                if (mGetPerc) finalPrice = (originalPrice * getNum(mGetPerc[1]) + (originalPrice * (1 - getNum(mGetPerc[3])/100) * getNum(mGetPerc[2]))) / (getNum(mGetPerc[1]) + getNum(mGetPerc[2]));

                else {
                    let mBuyPercOff = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:to\s*)?(?:get|enjoy)\s+([0-9.]+)%\s*off/);
                    if (mBuyPercOff) finalPrice = originalPrice * (1 - (getNum(mBuyPercOff[2]) / 100));

                    else {
                        let mGetFree = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:get|free).*?\b([0-9]+)\b(?!\s*%)/);
                        if (mGetFree) finalPrice = (originalPrice * getNum(mGetFree[1])) / (getNum(mGetFree[1]) + getNum(mGetFree[2]));

                        else {
                            let m2ndFor = p.match(/(?:second|2nd).*?(?:for|at)\s*\$([0-9.]+)/);
                            if (m2ndFor) finalPrice = (originalPrice + getNum(m2ndFor[1])) / 2;

                            else if (p.match(/(?:second|2nd).*?half/)) finalPrice = (originalPrice * 1.5) / 2;

                            else {
                                let m2ndPerc = p.match(/(?:second|2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:second|2nd)/);
                                if (m2ndPerc) finalPrice = (originalPrice * (2 - (getNum(m2ndPerc[1] || m2ndPerc[2]) / 100))) / 2;

                                else {
                                    let mSave = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?save.*?\$([0-9.]+)/);
                                    if (mSave) finalPrice = (originalPrice * getNum(mSave[1]) - getNum(mSave[2])) / getNum(mSave[1]);

                                    else {
                                        let mFor = p.match(/\b([0-9]+)\b.*?(?:for|at)\s*\$([0-9.]+)/);
                                        if (mFor && !is2nd) finalPrice = getNum(mFor[2]) / getNum(mFor[1]);

                                        else {
                                            let mPerc = p.match(/([0-9.]+)%\s*off/);
                                            if (mPerc && !is2nd) finalPrice = originalPrice * (1 - (getNum(mPerc[1]) / 100));

                                            else if (p.includes('half price') && !is2nd) finalPrice = originalPrice * 0.5;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 🛡️ 終極防線 + Google Sheet 觸發機制
        if (finalPrice !== null) {
            if (finalPrice >= originalPrice || finalPrice < (originalPrice * 0.1)) {
                logUnknownPromo(enPromoText, originalPrice, finalPrice);
                return null;
            }
            return finalPrice; 
        } else {
            if (enPromoText.trim() !== '') {
                logUnknownPromo(enPromoText, originalPrice, null);
            }
            return null;
        }

    } catch(e) { 
        console.error("Promo Engine Error:", e);
        return null; 
    }
}