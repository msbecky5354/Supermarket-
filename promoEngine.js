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

        // 🛡️ 終極防線 + Google Sheet 觸發機制 (✅ 已修正：容許 >= 原價通關)
        if (finalPrice !== null) {
            // 💡 容許 finalPrice >= originalPrice 通過，交畀 UI 去顯示 🤦🏼‍♀️ 標籤
            if (finalPrice < (originalPrice * 0.1)) {
                if (typeof logUnknownPromo === 'function') logUnknownPromo(enPromoText, originalPrice, finalPrice);
                return null;
            }
            return finalPrice; 
        } else {
            if (enPromoText.trim() !== '') {
                if (typeof logUnknownPromo === 'function') logUnknownPromo(enPromoText, originalPrice, null);
            }
            return null;
        }

    } catch(e) { 
        console.error("Promo Engine Error:", e);
        return null; 
    }
} // ⚠️ 呢個括號好重要！佢結束咗 calculateAvgPrice，將下面兩個 Function 放返出嚟。


// 💡 升級版 Google 圖片搜尋 (✅ 已搬出全域，並支援直接傳入完整名字)
function performGoogleSearch(searchQuery) {
    const modal = document.getElementById('googleSearchModal');
    const iframe = document.getElementById('googleSearchIframe');
    
    if (modal && iframe) {
        // 設置 iframe URL (tbm=isch 係 Google 圖片搜尋參數)
        iframe.src = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(searchQuery);
        // 顯示 Modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        // 🛡️ 防彈機制：如果萬一 index.html 搵唔到 Modal，就直接彈出新分頁去搜尋！
        window.open('https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(searchQuery), '_blank');
    }
}

function closeGoogleSearchModal() {
    const modal = document.getElementById('googleSearchModal');
    const iframe = document.getElementById('googleSearchIframe');
    
    if (modal && iframe) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        iframe.src = ''; // 清空 iframe 停止載入，慳資源
    }
}



// searchEngine.js - 修正版/////////////////////////////////////////////////////////////////////////////////////////////////

function getExactMatch(q) {
    const trimmedQ = q.trim();
    for (let cat1 in structuredData) {
        for (let cat2 in structuredData[cat1]) {
            for (let pName in structuredData[cat1][cat2]) {
                const info = structuredData[cat1][cat2][pName];
                if (pName === trimmedQ || (info.brand && info.brand === trimmedQ)) {
                    return { name: pName, info: info };
                }
            }
        }
    }
    return null;
}

function getCategories() {
    const responses = (typeof botResponses !== 'undefined' && botResponses[currentLang]) ? botResponses[currentLang] : {};
    return [
        { words: ['你好', 'hello', 'hey', '早晨', '嗨', '您好', '喂', '哈囉', '午安', '哈佬', 'good morning', 'good afternoon'], reply: responses.replyGreeting },
        { words: ['多謝', 'thank', '謝謝', '唔該', 'thx', '谢谢', 'tq', 'ty', '感激', '感恩'], reply: responses.replyThanks },
        { words: ['拜拜', '88', 'bye', '再見', '走先', 'cya', '掰掰', 'see ya', '下次見', '閃先', '早唞', 'good night', '晚安', 'goodnight'], reply: responses.replyBye },
        { words: ['天氣', 'weather', '落雨', '好熱', '好凍', '凍死', '打風', '紅雨', '黑雨', '黃雨', '行雷', '打雷', '暴雨', '颱風', '熱死', '凍冰冰', '天晴', '落狗屎'], reply: responses.replySmallTalkExtra },
        { words: ['好叻', 'smart', '好用', '好棒', 'good', '厲害', '犀利', '叻仔', '叻女', '好勁', '好掂', '世一', '好讚', 'awesome', 'brilliant', 'excellent', '好正', '超正'], reply: responses.replyPraise },
        { words: ['笑話', 'joke', 'gag', '好悶', '悶悶地', '講笑', '無聊', '冇聊', '冇嘢做', '解悶', '搞笑', 'funny', 'boring', '悶死', '有冇搞錯', '𠱁下我', '幽默'], reply: responses.replyJoke },
        { words: ['幾歲', '幾多歲', '做緊咩', '食飯', '識幾多', '得閒', '有空', '做緊乜', '食咗飯未', 'busy', 'free', '吹水', '傾偈'], reply: responses.replySmallTalkExtra },
        { words: ['omg', 'oh my god', '我的天', '天呀', '救命', '痴線', '黐線', '哇塞', 'wow', '大鑊', '死啦', 'crazy', 'insane'], reply: responses.replyOmg },
        { words: ['點用', '點樣', '點做', '幫手', '唔明', 'help', '如何', '唔識', '教學', '求救', 'sos', '教我', '點算', '指南', '操作', '點搞'], reply: responses.replyHelp },
        { words: ['你是誰', '你係邊個', 'who are you', 'who r u', '咩名', '乜名', '乜水', '咩水', '邊位', '機器人', 'robot', 'chatbot', '人工智能', 'ai助手', '你係咩', '咩機', '咩黎', '咩嚟', '咩來'], reply: responses.replyWho },
        { words: ['好啱', '啱呀', '對呀', '係呀', '沒錯', '同意', '正解', '講得好', 'yeah', 'yes', 'yup', 'yep', 'of course', '絕對', '當然', '係囉', '冇錯', '係咪'], reply: responses.replyAgreement },
        { words: ['搵唔到', '找不到', '冷門', '冇貨', '缺貨', '冇啦', '斷貨', 'out of stock', '搵極都冇', '無貨', '售罄', '賣晒'], reply: responses.r_no_product },
        { words: ['個資', '隱私', '私隱', '資料安全', '個人資料', '保密', '資料外洩', '俾人偷', '私穩'], reply: responses.r_privacy },
        { words: ['提示', '鐘仔', 'alert', '追蹤', '到價', '通知', 'notify', '鬧鐘', '提我', '降價', '減價', '平咗', 'mark低'], reply: responses.r_alert },
        { words: ['差價', '激抵', '唔抵', '好貴', '太貴', '平價', '便宜', '呃錢', '水魚', '好平', '超平', '抵買', '抵到爛', '最平', '最抵', '搵笨', '海鮮價', '暴利'], reply: responses.r_gap },
        { words: ['畫面', '主螢幕', '安裝', '桌面', '加落去', '手機app', '下載', 'download', '主頁', '捷徑', 'shortcut', 'pwa', '裝app', '裝機'], reply: responses.r_home }
    ];
}

function checkSmallTalk(q, exactOnly = false) {
    const low = q.toLowerCase().trim();
    const categories = getCategories(); 
    for (let cat of categories) {
        if (exactOnly) {
            if (cat.words.some(kw => low === kw)) return cat.reply;
        } else {
            if (cat.words.some(kw => low.includes(kw))) return cat.reply;
        }
    }
    return null;
}

function getIntentAndReply(q) {
    const low = q.toLowerCase().trim();
    const categories = getCategories();
    const match = categories.find(c => c.words.some(kw => low.includes(kw)));
    if (match) return { type: 'CHAT', reply: match.reply };
    return { type: 'SEARCH', query: q };
}

function calculateRelevance(query, pName, brand) {
    let score = 0;
    let q = query.toLowerCase();
    let n = pName.toLowerCase();
    let b = (brand || '').toLowerCase();
    if (b && b.length > 1 && q.includes(b)) { score += 50; q = q.replace(b, ''); }
    let matchedChunks = 0;
    for (let i = 0; i < q.length - 1; i++) {
        let chunk = q.substring(i, i + 2);
        if (n.includes(chunk)) { score += 15; matchedChunks++; }
    }
    if (matchedChunks === 0) {
        for (let char of q) { if (n.includes(char)) score += 2; }
    }
    return score;
}

function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    const rawQuery = query.trim();
    currentKeyword = isDiscountOnly ? '' : normalizeStr(rawQuery).trim();
    const isAll = ['所有', '全部', 'all', 'list','*'].some(kw => currentKeyword === normalizeStr(kw) || currentKeyword === kw) || (!currentKeyword && !isDiscountOnly);

    if (!isDiscountOnly) {
        let exactTalk = checkSmallTalk(rawQuery, true);
        if (exactTalk) { addBotMessage(exactTalk); return; }
    }

    let html = '';
    let scoredProducts = []; 
    Object.keys(structuredData[selectedCat1] || {}).forEach(cat2 => {
        Object.keys(structuredData[selectedCat1][cat2]).forEach(pName => {
            const info = structuredData[selectedCat1][cat2][pName];
            const hasDiscount = info.prices.some(p => p.promoDisplay || p.promoCalc);
            const matchesKeyword = isAll || info.searchKeywords.includes(currentKeyword);
            const matchesDiscount = !isDiscountOnly || hasDiscount;
            if (matchesKeyword && matchesDiscount) { html += generateProductCardHTML(pName, info); }
            else if (!isAll && currentKeyword.length >= 2 && matchesDiscount) {
                let score = calculateRelevance(currentKeyword, info.searchKeywords, info.brand);
                if (score > 20) scoredProducts.push({ name: pName, info: info, score: score });
            }
        });
    });
    
    if (!html && scoredProducts.length > 0) {
        scoredProducts.sort((a, b) => b.score - a.score);
        let rescueHtml = '';
        scoredProducts.slice(0, 4).forEach(m => { rescueHtml += generateProductCardHTML(m.name, m.info); });
        addBotMessage("搵唔到完全匹配，但我幫你搵到最相關嘅產品：", rescueHtml);
    } else if (!html) {
        addBotMessage(checkSmallTalk(rawQuery, false) || uiText[currentLang].chatNoResult);
    } else {
        addBotMessage(isAll ? uiText[currentLang].chatShowAll : uiText[currentLang].chatFound, html);
    }
}

function toggleCardLang(btn) {
    const card = btn.closest('.bg-white') || btn.closest('div');
    const nameSpan = card.querySelector('.product-name');
    const brandDiv = card.querySelector('.product-brand');
    
    // 獲取數據
    const zh = btn.getAttribute('data-zh');
    const en = btn.getAttribute('data-en');
    const bZh = btn.getAttribute('data-brand-zh');
    const bEn = btn.getAttribute('data-brand-en');
    
    // 切換邏輯
    if (nameSpan.innerText === zh) {
        // 切換做英文
        nameSpan.innerText = en;
        if(brandDiv) brandDiv.innerText = bEn; 
        btn.innerText = "中"; 
    } else {
        // 切換做中文
        nameSpan.innerText = zh;
        if(brandDiv) brandDiv.innerText = bZh;
        btn.innerText = "EN";
    }
}





// 如果你搵唔到呢啲函數，請加返入去 index.html 的 script 區
function toggleCategories() {
    const container = document.getElementById('collapsibleCatContainer');
    const icon = document.getElementById('catToggleIcon');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        container.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

function openDisclaimerModal() {
    document.getElementById('disclaimerModal').classList.remove('hidden');

}

function performGoogleSearch(btnElement) {
    // 獲取整個產品卡片容器
    const container = btnElement.closest('.bg-white') || btnElement.closest('.bg-slate-800');
    
    // 獲取產品名稱元素和品牌元素
    const nameEl = container.querySelector('.product-name');
    const brandEl = container.querySelector('.product-brand');
    
    if (nameEl) {
        // 取得名稱與品牌 (預設使用 data-zh)
        const productName = nameEl.getAttribute('data-zh') || "";
        const brandName = brandEl ? (brandEl.getAttribute('data-brand-zh') || "") : "";
        
        // 組合搜尋字串 (合併品牌與名稱)
        // 檢查如果品牌是 "綜合品牌"，可以考慮不加進去，這裡預設全部加入
        const query = `${brandName} ${productName}`.trim();
        
        // 執行搜尋
        const googleImagesUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
        
        window.open(googleImagesUrl, '_blank');
    } else {
        console.error("搵唔到產品名稱，請檢查 .product-name class");
    }
}
