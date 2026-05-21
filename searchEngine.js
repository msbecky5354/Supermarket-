// searchEngine.js

// 🧠 升級版閒聊大腦：支援「精準 (Exact)」與「模糊 (Fuzzy)」雙模式
function checkSmallTalk(q, exactOnly = false) {
    const low = q.toLowerCase().trim();

    // 將所有閒聊詞庫分門別類 (保留咗你新增嘅 hey, 晚安, 午安！)
    const categories = [
        { words: ['你好', 'hi', 'hello', 'hey', '早晨', '嗨', '您好', '喂', '哈囉', '晚安', '午安'], reply: uiText[currentLang].replyGreeting },
        { words: ['多謝', 'thank', '謝謝', '唔該', 'thx', '感', '谢谢'], reply: uiText[currentLang].replyThanks },
        { words: ['拜拜', '88', 'bye', '再見', '走先', 'goodbye', 'cya', '掰','走先'], reply: uiText[currentLang].replyBye },
        { words: ['天氣', 'weather', '落雨', '好熱', '凍', '打風'], reply: uiText[currentLang].replySmallTalkExtra },
        { words: ['叻', 'smart', '好用', '棒', 'good', '厲害', '犀利'], reply: uiText[currentLang].replyPraise },
        { words: ['笑話', 'joke', '好悶', '講笑', '無聊', '冇聊'], reply: uiText[currentLang].replyJoke },
        { words: ['幾歲', '做緊咩', '食飯', '識幾多', '得閒', '有空'], reply: uiText[currentLang].replySmallTalkExtra },
        // 👇 加喺呢度！專捉 omg 同埋其他感嘆詞！
        { words: ['omg', 'oh my god', '我的天', '天呀', '救命', '痴線', '黐線', '哇', 'wow'], reply: uiText[currentLang].replyOmg },
      ];

    for (let cat of categories) {
        if (exactOnly) {
            // 第一層：必須 100% 完全相同 (解決 "hi" 撞 "chicken" 問題)
            if (cat.words.some(kw => low === kw)) return cat.reply;
        } else {
            // 第三層：只要包含該字眼就中 (解決 "今日天氣" 撞唔中 "天氣" 問題)
            if (cat.words.some(kw => low.includes(kw))) return cat.reply;
        }
    }
    return null;
}

// 🛒 升級版搜尋引擎：落實 4 層過濾機制
function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    const rawQuery = query.trim().toLowerCase();
    
    if (!isDiscountOnly) { 
        currentKeyword = normalizeStr(query).trim(); 
        // 防炒車保底：如果 normalizeStr 意外清空咗英文，用返原始字串
        if (!currentKeyword && rawQuery) currentKeyword = rawQuery; 
    }

    // 🛑 終極修復：保留你原本對 isAll 嘅嚴格比對
    const isAll = ['所有', '全部', 'all', 'list','*'].some(kw => currentKeyword === normalizeStr(kw) || currentKeyword === kw) || (!currentKeyword && !isDiscountOnly);

    // ==========================================
    // 🛡️ 第一層防線：精準命中閒聊 (Exact Match)
    // ==========================================
    if (!isDiscountOnly) {
        let exactTalk = checkSmallTalk(rawQuery, true); // 傳入 true，啟動精準模式
        if (exactTalk) {
            addBotMessage(exactTalk);
            return; // 答完即刻收工，唔去查產品庫！
        }
    }

    // ==========================================
    // 🛡️ 第二層防線：搜尋產品
    // ==========================================
    let html = '';
    Object.keys(structuredData[selectedCat1]).forEach(cat2 => {
        Object.keys(structuredData[selectedCat1][cat2]).forEach(pName => {
            const info = structuredData[selectedCat1][cat2][pName];
            const hasDiscount = info.prices.some(p => p.promoDisplay || p.promoCalc);
            
            const matchesKeyword = isAll || info.searchKeywords.includes(currentKeyword);
            const matchesDiscount = !isDiscountOnly || hasDiscount;
            if (matchesKeyword && matchesDiscount) { html += generateProductCardHTML(pName, info); }
        });
    });
    
    if (!html) {
        // ==========================================
        // 🛡️ 第三層防線：模糊命中閒聊 (Fuzzy Match)
        // ==========================================
        let fuzzyTalk = null;
        if (!isDiscountOnly) {
            fuzzyTalk = checkSmallTalk(rawQuery, false); // 傳入 false，啟動包含模式
        }
        
        if (fuzzyTalk) {
            addBotMessage(fuzzyTalk);
        } else {
            // ==========================================
            // 🛡️ 第四層防線：真係咩都搵唔到 (Fallback)
            // ==========================================
            let noResultMsg = uiText[currentLang].chatNoResult;
            if (isDiscountOnly) {
                const langMsgs = {
                    'zh-Hant': currentKeyword ? `「${currentKeyword}」暫時未有優惠貨品喎！🤷‍♂️` : "呢個分類暫時未有優惠貨品喎！🤷‍♂️",
                    'zh-Hans': currentKeyword ? `「${currentKeyword}」暂时没有优惠商品哦！🤷‍♂️` : "该分类下暂时没有优惠商品哦！🤷‍♂️",
                    'en': currentKeyword ? `No discounts for "${currentKeyword}" found! 🤷‍♂️` : "No discounted products found in this category! 🤷‍♂️"
                };
                noResultMsg = langMsgs[currentLang];
            }
            addBotMessage(noResultMsg);
        }
    } else {
        addBotMessage(isAll ? uiText[currentLang].chatShowAll : uiText[currentLang].chatFound, html);
    }
}