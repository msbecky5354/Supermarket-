// searchEngine.js
function checkSmallTalk(q) {
    // 將用戶輸入轉做小階，方便做 LIKE 比對
    const low = q.toLowerCase();

    // 💡 呢度嘅 .some(kw => low.includes(kw)) 就等如 SQL 嘅 LIKE '%kw%'
    // 所以我哋只放「最核心嘅單字」，唔寫長句，做到真正嘅 Fuzzy Match！

    // 1. 問候 (e.g. LIKE '%你好%' OR LIKE '%hello%')
    const greetings = ['你好', 'hi', 'hello','hey', '早晨', '嗨', '您好', '喂', '哈囉','晚安','午安'];
    if (greetings.some(kw => low.includes(kw))) return uiText[currentLang].replyGreeting;

    // 2. 感謝
    const thanks = ['多謝', 'thank', '謝謝', '唔該', 'thx', '感', '谢谢'];
    if (thanks.some(kw => low.includes(kw))) return uiText[currentLang].replyThanks;

    // 3. 道別
    const goodbyes = ['拜拜', '88', 'bye', '再見', '走先', 'goodbye', 'cya', '掰'];
    if (goodbyes.some(kw => low.includes(kw))) return uiText[currentLang].replyBye;

    // 4. 天氣類 (只要句嘢 LIKE '%天氣%' 或 LIKE '%落雨%' 就中！)
    const weathers = ['天氣', 'weather', '落雨', '好熱', '凍', '打風'];
    if (weathers.some(kw => low.includes(kw))) return uiText[currentLang].replySmallTalkExtra;

    // 5. 讚美與講笑
    const praises = ['叻', 'smart', '好用', '棒', 'good', '厲害', '犀利'];
    if (praises.some(kw => low.includes(kw))) return uiText[currentLang].replyPraise;
    
    const jokes = ['笑話', 'joke', '好悶', '講笑', '無聊', '冇聊'];
    if (jokes.some(kw => low.includes(kw))) return uiText[currentLang].replyJoke;

    // 6. 關於 Bot 自己 (捕捉用戶問 Bot 嘅問題)
    const aboutBot = ['幾歲', '做緊咩', '食飯', '識幾多', '得閒', '有空'];
    if (aboutBot.some(kw => low.includes(kw))) return uiText[currentLang].replySmallTalkExtra;

    return null; // ❌ 如果全部 LIKE 都唔中，就 return null 畀系統出「搵唔到貨品」
}

function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    const rawQuery = query.trim().toLowerCase(); // 攞個最原始嘅輸入做對比
    
    if (!isDiscountOnly) { 
        currentKeyword = normalizeStr(query).trim(); 
        // 防炒車：如果 normalizeStr 意外清空咗英文，用返原始字串保底
        if (!currentKeyword && rawQuery) currentKeyword = rawQuery; 
    }
    
    // 🛑 特權攔截器：如果 100% 命中以下打招呼字眼，直接傾偈，唔查產品！
    // (防止 "hi" 誤中 C"hi"cken，或者 "hello" 誤中 "Marshmallow")
    const exactGreetings = ['hi', 'hello', '你好', '早晨', '喂'];
    if (exactGreetings.includes(rawQuery) && !isDiscountOnly) {
        addBotMessage(checkSmallTalk(query));
        return; // 答完即刻收工，唔去查貨品
    }

    // 🛑 嚴格限制：只有真正打「所有」或者吉字串，先會觸發 Show All
    const isAll = ['所有', '全部', 'all', 'list'].includes(currentKeyword) || (rawQuery === '' && !isDiscountOnly);
    
    let html = '';
    
    Object.keys(structuredData[selectedCat1]).forEach(cat2 => {
        Object.keys(structuredData[selectedCat1][cat2]).forEach(pName => {
            const info = structuredData[selectedCat1][cat2][pName];
            const hasDiscount = info.prices.some(p => p.promoDisplay || p.promoCalc);
            
            // 搜尋比對
            const matchesKeyword = isAll || info.searchKeywords.includes(currentKeyword);
            const matchesDiscount = !isDiscountOnly || hasDiscount;
            if (matchesKeyword && matchesDiscount) { html += generateProductCardHTML(pName, info); }
        });
    });
    
    if (!html) {
        // 💡 搵唔到貨品？先查吓係咪其他閒聊 (Small Talk)！
        let talk = null;
        if (!isDiscountOnly && typeof checkSmallTalk === 'function') {
            talk = checkSmallTalk(query); 
        }
        
        if (talk) {
            // 🤖 中咗閒聊！直接出傾偈答案
            addBotMessage(talk);
        } else {
            // ❌ 連閒聊都唔係，先至出找不到產品
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
    }
    else {
        addBotMessage(isAll ? uiText[currentLang].chatShowAll : uiText[currentLang].chatFound, html);
    }
}
}