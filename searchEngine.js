// searchEngine.js - 修正版

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
