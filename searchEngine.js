// searchEngine.js
function checkSmallTalk(q) {
    const low = q.toLowerCase();

    // 新增更多問候語
    const greetings = ['你好', 'hi', 'hello', '早晨', '嗨', '您好', '喂', '哈囉'];
    if (greetings.some(kw => low.includes(kw))) return uiText[currentLang].replyGreeting;

    // 感謝語句
    const thanks = ['多謝', 'thank', '謝謝', '唔該', 'thx', '감사합니다', '谢谢'];
    if (thanks.some(kw => low.includes(kw))) return uiText[currentLang].replyThanks;

    // 道別語句
    const goodbyes = ['拜拜', '88','bye', '再見', '走先', 'goodbye', 'cya', '掰掰', '拜拜啦'];
    if (goodbyes.some(kw => low.includes(kw))) return uiText[currentLang].replyBye;

    // 褒獎或讚美
    const praises = ['叻', 'smart', '好用', '棒', 'good', '厲害', '厲害啦', '好犀利'];
    if (praises.some(kw => low.includes(kw))) return uiText[currentLang].replyPraise;

    // 幽默或無聊相關
    const jokes = ['笑話', 'joke', '好悶', '講笑', '無聊', '冇聊', '笑死我'];
    if (jokes.some(kw => low.includes(kw))) return uiText[currentLang].replyJoke;

    // 其他常用表達
    const smallTalkExtras = [
        '今天天氣幾好', '今天天氣點', '你幾時有空', '你識幾多', '你幾歲',
        '你幾忙', '你做緊咩', '你幾耐未食飯'
    ];
    if (smallTalkExtras.some(phrase => low.includes(phrase))) {
        return uiText[currentLang].replySmallTalkExtra;
    }

    return null;
}

function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    if (!isDiscountOnly) { currentKeyword = normalizeStr(query).trim(); }
    
    // 🛑 終極修復：將 .includes 改為 === (完全等如)
    // 咁樣打 "Hallo" 或 "Marshmallow" 都絕對唔會誤觸 "all" 指令！
    const isAll = ['所有', '全部', 'all', 'list'].some(kw => currentKeyword === normalizeStr(kw) || currentKeyword === kw) || (!currentKeyword && !isDiscountOnly);
    
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
        // 💡 搵唔到貨品？停一停，先查吓係咪 Small Talk (閒聊)！
        let talk = null;
        if (!isDiscountOnly && typeof checkSmallTalk === 'function') {
            talk = checkSmallTalk(query); // 將用戶打嘅字交畀閒聊大腦
        }
        
        if (talk) {
            // 🤖 中咗閒聊！直接出傾偈答案
            addBotMessage(talk);
        } else {
            // ❌ 連閒聊都唔係，先至真正話搵唔到
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