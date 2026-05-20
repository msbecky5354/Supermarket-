// searchEngine.js
function checkSmallTalk(q) {
    const low = q.toLowerCase();
    if (['你好', 'hi', 'hello', '早晨', '嗨'].some(kw => low.includes(kw))) return uiText[currentLang].replyGreeting;
    if (['多謝', 'thank', '謝謝', '唔該', 'thx'].some(kw => low.includes(kw))) return uiText[currentLang].replyThanks;
    if (['拜拜', 'bye', '再見', '走先', 'goodbye', 'cya'].some(kw => low.includes(kw))) return uiText[currentLang].replyBye;
    if (['叻', 'smart', '好用', '棒', 'good', '厲害'].some(kw => low.includes(kw))) return uiText[currentLang].replyPraise;
    if (['笑話', 'joke', '好悶', '講笑', '無聊'].some(kw => low.includes(kw))) return uiText[currentLang].replyJoke;
    return null; 
}

function performScopedSearch(query) {
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    if (!isDiscountOnly) { currentKeyword = normalizeStr(query).trim(); }
    const isAll = ['所有', '全部', 'all', 'list'].some(kw => currentKeyword.includes(normalizeStr(kw))) || (!currentKeyword && !isDiscountOnly);
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
    else addBotMessage(isAll ? uiText[currentLang].chatShowAll : uiText[currentLang].chatFound, html);
}