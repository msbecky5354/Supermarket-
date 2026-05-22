// searchEngine.js
      // searchEngine.js

// 1. 意圖分類器 (Intent Classifier)
function classifyIntent(q) {
    const low = q.toLowerCase().trim();
    
    // 優先級 1: 強搜索詞
    const searchKeywords = ['搵', '買', 'search', '睇吓', 'show', '幾多', '價錢', '有咩', '邊隻', 'list'];
    if (searchKeywords.some(kw => low.includes(kw))) return 'SEARCH';

    // 優先級 2: 閒聊/FAQ
    if (checkSmallTalk(q)) return 'CHAT';

    // 優先級 3: 模糊商品比對 (檢查是否屬於 DB 內的產品)
    if (isProductKeyword(low)) return 'SEARCH';

    return 'CHAT'; // 預設跌落閒聊，防止無故撈 Data
}

// 2. 商品詞庫過濾 (停用詞處理)
function extractProductKeywords(q) {
    const stopWords = ['我', '想', '要', '兩', '包', '罐', '支', '盒', '嘅', '呀', '啦', '幫我', '買'];
    let cleaned = q;
    stopWords.forEach(word => cleaned = cleaned.replace(new RegExp(word, 'g'), ''));
    return cleaned.trim();
}
    




// 🧠 升級版閒聊大腦：支援「精準 (Exact)」與「模糊 (Fuzzy)」雙模式
function checkSmallTalk(q, exactOnly = false) {
    const low = q.toLowerCase().trim();

    // 將所有閒聊詞庫分門別類
    const categories = [
        { words: ['你好', 'hi', 'hello', 'hey', '早晨', '嗨', '您好', '喂', '哈囉', '午安'], reply: uiText[currentLang].replyGreeting },
        { words: ['多謝', 'thank', '謝謝', '唔該', 'thx', '感', '谢谢','good night','晚安'], reply: uiText[currentLang].replyThanks },
        { words: ['拜拜', '88', 'bye', '再見', '走先', 'goodbye', 'cya', '掰','走先'], reply: uiText[currentLang].replyBye },
        { words: ['天氣', 'weather', '落雨', '好熱', '凍', '打風','紅雨','黑雨','黃雨','行雷','打雷'], reply: uiText[currentLang].replySmallTalkExtra },
        { words: ['叻', 'smart', '好用', '棒', 'good', '厲害', '犀利'], reply: uiText[currentLang].replyPraise },
        { words: ['笑話', 'joke', '好悶', '講笑', '無聊', '冇聊','有冇搞錯'], reply: uiText[currentLang].replyJoke },
        { words: ['幾歲','幾多歲','做緊咩', '食飯', '識幾多', '得閒', '有空'], reply: uiText[currentLang].replySmallTalkExtra },
        { words: ['omg', 'oh my god', '我的天', '天呀', '救命', '痴線', '黐線', '哇', 'wow'], reply: uiText[currentLang].replyOmg },
        { words: ['點用', '點樣', '點做', '幫手', '唔明', 'help', '如何', '唔識', '教學'], reply: uiText[currentLang].replyHelp },
        { words: ['你是誰', '你係邊個', 'who are you', '咩名', '機器人', 'robot', '人工智能', 'ai', '你係咩'], reply: uiText[currentLang].replyWho },
        { words: ['啱', '對', '係呀', '沒錯', '同意', '正解', '講得好', 'yeah', 'yes'], reply: uiText[currentLang].replyAgreement },
        
        // 👇 新功能邏輯 (完全保持你嘅格式)
        { words: ['搵唔到', '找不到', '冷門', '冇貨', '缺貨'], reply: uiText[currentLang].r_no_product },
        { words: ['個資', '隱私', '私隱', '安全', '個人資料'], reply: uiText[currentLang].r_privacy },
        { words: ['提示', '鐘仔', 'alert', '追蹤', '到價'], reply: uiText[currentLang].r_alert },
        { words: ['差價', '激抵', '唔抵', '貴', '便宜'], reply: uiText[currentLang].r_gap },
        { words: ['畫面', '主螢幕', '安裝', '桌面', '加落去'], reply: uiText[currentLang].r_home }
    ];

    for (let cat of categories) {
        if (exactOnly) {
            // 第一層：必須 100% 完全相同
            if (cat.words.some(kw => low === kw)) return cat.reply;
        } else {
            // 第三層：只要包含該字眼就中
            if (cat.words.some(kw => low.includes(kw))) return cat.reply;
        }
    }
    return null;
}

// 🛒 升級版搜尋引擎：落實 4 層過濾機制
function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    const rawQuery = query.trim().toLowerCase();
    
    // 💡 修正邏輯：如果係撳「優惠掣」，強制將搜尋關鍵字清空，
    // 咁樣後面嘅 searchKeywords.includes(currentKeyword) 就會變成 true (isAll 邏輯)
    if (isDiscountOnly) {
        currentKeyword = ''; 
    } else {
        currentKeyword = normalizeStr(query).trim();
        if (!currentKeyword && rawQuery) currentKeyword = rawQuery;
    }

    // 🛡️ 第一層防線：精準命中閒聊
    // 注意：如果撳咗「優惠掣」，isDiscountOnly 係 true，呢度會自動跳過，符合預期
    if (!isDiscountOnly) {
        let exactTalk = checkSmallTalk(rawQuery, true);
        if (exactTalk) {
            addBotMessage(exactTalk);
            return;
        }
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