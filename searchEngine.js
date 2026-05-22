// searchEngine.js
     
function getExactMatch(q) {
    const trimmedQ = q.trim();
    // 遍歷所有貨品，檢查名稱或品牌是否「完全等於」用戶輸入
    for (let cat1 in structuredData) {
        for (let cat2 in structuredData[cat1]) {
            for (let pName in structuredData[cat1][cat2]) {
                const info = structuredData[cat1][cat2][pName];
                // 這裡改成嚴格相等 (===)
                if (pName === trimmedQ || (info.brand && info.brand === trimmedQ)) {
                    return { name: pName, info: info }; // 搵到就 return
                }
            }
        }
    }
    return null; // 真係搵唔到，先去下一步
}

// 🧠 1. 將 Categories 包裝成 Function (完美解決 currentLang 載入順序報錯嘅 Bug！)
// 呢個版本已經徹底清走晒所有重複字，以及會撞超市貨品嘅危險字根 (bb, app, ai, bot, 平, 貴, 凍)
function getCategories() {
    return [
        { words: ['你好', 'hello', 'hey', '早晨', '嗨', '您好', '喂', '哈囉', '午安', '哈佬', 'good morning', 'good afternoon'], reply: uiText[currentLang].replyGreeting },
        { words: ['多謝', 'thank', '謝謝', '唔該', 'thx', '谢谢', 'tq', 'ty', '感激', '感恩'], reply: uiText[currentLang].replyThanks },
        { words: ['拜拜', '88', 'bye', '再見', '走先', 'cya', '掰掰', 'see ya', '下次見', '閃先', '早唞', 'good night', '晚安', 'goodnight'], reply: uiText[currentLang].replyBye },
        { words: ['天氣', 'weather', '落雨', '好熱', '好凍', '凍死', '打風', '紅雨', '黑雨', '黃雨', '行雷', '打雷', '暴雨', '颱風', '熱死', '凍冰冰', '天晴', '落狗屎'], reply: uiText[currentLang].replySmallTalkExtra },
        { words: ['好叻', 'smart', '好用', '好棒', 'good', '厲害', '犀利', '叻仔', '叻女', '好勁', '好掂', '世一', '好讚', 'awesome', 'brilliant', 'excellent', '好正', '超正'], reply: uiText[currentLang].replyPraise },
        { words: ['笑話', 'joke', 'gag', '好悶', '悶悶地', '講笑', '無聊', '冇聊', '冇嘢做', '解悶', '搞笑', 'funny', 'boring', '悶死', '有冇搞錯', '𠱁下我', '幽默'], reply: uiText[currentLang].replyJoke },
        { words: ['幾歲', '幾多歲', '做緊咩', '食飯', '識幾多', '得閒', '有空', '做緊乜', '食咗飯未', 'busy', 'free', '吹水', '傾偈'], reply: uiText[currentLang].replySmallTalkExtra },
        { words: ['omg', 'oh my god', '我的天', '天呀', '救命', '痴線', '黐線', '哇塞', 'wow', '大鑊', '死啦', 'crazy', 'insane'], reply: uiText[currentLang].replyOmg },
        { words: ['點用', '點樣', '點做', '幫手', '唔明', 'help', '如何', '唔識', '教學', '求救', 'sos', '教我', '點算', '指南', '操作', '點搞'], reply: uiText[currentLang].replyHelp },
        { words: ['你是誰', '你係邊個', 'who are you', 'who r u', '咩名', '乜名', '乜水', '咩水', '邊位', '機器人', 'robot', 'chatbot', '人工智能', 'ai助手', '你係咩', '咩機', '咩黎', '咩嚟', '咩來'], reply: uiText[currentLang].replyWho },
        { words: ['好啱', '啱呀', '對呀', '係呀', '沒錯', '同意', '正解', '講得好', 'yeah', 'yes', 'yup', 'yep', 'of course', '絕對', '當然', '係囉', '冇錯', '係咪'], reply: uiText[currentLang].replyAgreement },
        { words: ['搵唔到', '找不到', '冷門', '冇貨', '缺貨', '冇啦', '斷貨', 'out of stock', '搵極都冇', '無貨', '售罄', '賣晒'], reply: uiText[currentLang].r_no_product },
        { words: ['個資', '隱私', '私隱', '資料安全', '個人資料', '保密', '資料外洩', '俾人偷', '私穩'], reply: uiText[currentLang].r_privacy },
        { words: ['提示', '鐘仔', 'alert', '追蹤', '到價', '通知', 'notify', '鬧鐘', '提我', '降價', '減價', '平咗', 'mark低'], reply: uiText[currentLang].r_alert },
        { words: ['差價', '激抵', '唔抵', '好貴', '太貴', '平價', '便宜', '呃錢', '水魚', '好平', '超平', '抵買', '抵到爛', '最平', '最抵', '搵笨', '海鮮價', '暴利'], reply: uiText[currentLang].r_gap },
        { words: ['畫面', '主螢幕', '安裝', '桌面', '加落去', '手機app', '下載', 'download', '主頁', '捷徑', 'shortcut', 'pwa', '裝app', '裝機'], reply: uiText[currentLang].r_home }
    ];
}

// 🧠 2. 升級版閒聊大腦：支援「精準 (Exact)」與「模糊 (Fuzzy)」雙模式
function checkSmallTalk(q, exactOnly = false) {
    const low = q.toLowerCase().trim();
    // 每次執行先呼叫函數，確保攞到正確嘅語言設定，唔會報錯
    const categories = getCategories(); 

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

//核心邏輯：統一處理意圖
function getIntentAndReply(q) {
    const low = q.toLowerCase().trim();
    const categories = getCategories();
    
    // 檢查閒聊
    const match = categories.find(c => c.words.some(kw => low.includes(kw)));
    if (match) return { type: 'CHAT', reply: match.reply };
    
    // 否則視為搜尋
    return { type: 'SEARCH', query: q };
}

// 🛒 升級版搜尋引擎：落實 4 層過濾機制 (已清理重複多餘代碼)
function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    const rawQuery = query.trim().toLowerCase();
    
    if (isDiscountOnly) {
        currentKeyword = ''; 
    } else {
        currentKeyword = normalizeStr(query).trim();
        if (!currentKeyword && rawQuery) currentKeyword = rawQuery;
    }

    // 🛑 判斷是否為「顯示全部」
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