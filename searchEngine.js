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


    
 



// 🧠 升級版閒聊大腦：支援「精準 (Exact)」與「模糊 (Fuzzy)」雙模式
function checkSmallTalk(q, exactOnly = false) {
    const low = q.toLowerCase().trim();

    // 將所有閒聊詞庫分門別類
   const categories = [
    // 1. 打招呼 (加入常用口語、疊字、英文簡寫)
    { words: ['你好', 'hi', 'hello', 'hey', '早晨', '嗨', '您好', '喂', '哈囉', '午安', 'yo', 'hihi', '早', '哈佬', 'good morning', 'good afternoon'], reply: uiText[currentLang].replyGreeting },
    
    // 2. 道謝 (加入英文簡寫、口語極致簡化版)
    { words: ['多謝', 'thank', '謝謝', '唔該', 'thx', '感', '谢谢', 'tq', 'ty', '感激', '多謝晒', '唔該晒', 'thankyou', 'thanks'], reply: uiText[currentLang].replyThanks },
    
    // 3. 道別 (修正：將晚安搬過嚟，加入潮語、常見走先字眼)
    { words: ['拜拜', '88', 'bye', '再見', '走先', 'goodbye', 'cya', '掰', 'bb', 'see ya', '下次見', '閃先', '早唞', 'good night', '晚安', 'goodnight'], reply: uiText[currentLang].replyBye },
    
    // 4. 天氣 (涵蓋更多極端天氣字眼)
    { words: ['天氣', 'weather', '落雨', '好熱', '凍', '打風', '紅雨', '黑雨', '黃雨', '行雷', '打雷', '暴雨', '颱風', '熱死', '凍冰冰', '天晴', '落狗屎'], reply: uiText[currentLang].replySmallTalkExtra },
    
    // 5. 讚賞 (加入地道香港讚美人嘅字眼)
    { words: ['叻', 'smart', '好用', '棒', 'good', '厲害', '犀利', '叻仔', '叻女', '好勁', '好掂', '世一', '讚', 'awesome', 'brilliant', 'excellent', '正', '勁'], reply: uiText[currentLang].replyPraise },
    
    // 6. 講笑/無聊 (加入用家投訴悶嘅字眼)
    { words: ['笑話', 'joke', '好悶', '講笑', '無聊', '冇聊', '有冇搞錯', '爛gag', '搞笑', '解悶', 'boring', '悶死'], reply: uiText[currentLang].replyJoke },
    
    // 7. 閒聊問題 (涵蓋查問狀態)
    { words: ['幾歲', '幾多歲', '做緊咩', '食飯', '識幾多', '得閒', '有空', '做緊乜', '食咗飯未', 'busy', 'free', '吹水', '傾偈'], reply: uiText[currentLang].replySmallTalkExtra },
    
    // 8. 驚嘆 (加入更多強烈語氣詞)
    { words: ['omg', 'oh my god', '我的天', '天呀', '救命', '痴線', '黐線', '哇', 'wow', '大鑊', '死啦', '救命呀', 'crazy', 'insane', '痴線佬', '痴線㗎'], reply: uiText[currentLang].replyOmg },
    
    // 9. 求助 (加入更多功能性查詢)
    { words: ['點用', '點樣', '點做', '幫手', '唔明', 'help', '如何', '唔識', '教學', '求救', 'sos', '教我', '點算', '指南', '操作', '點搞'], reply: uiText[currentLang].replyHelp },
    
    // 10. 身份查問 (加入咗語音輸入常見嘅「乜名」、「叫咩名」)
    { words: ['你是誰', '你係邊個', 'who are you', '咩名', '你係乜名', '你叫咩名', '你叫乜水？', '叫咩名', '機器人', 'robot', '人工智能', 'ai', '你係咩', 'who r u', '咩機', '咩黎', '咩嚟', '咩來', 'bot'], reply: uiText[currentLang].replyWho },
    
    // 11. 認同/肯定 (加入中英口語肯定詞)
    { words: ['啱', '對', '係呀', '沒錯', '同意', '正解', '講得好', 'yeah', 'yes', 'yup', 'yep', 'of course', '絕對', '當然', '係囉', '冇錯', '係咪'], reply: uiText[currentLang].replyAgreement },
    
    // 👇 新功能邏輯 (針對超市/格價場景進行深度擴充)
    
    // 12. 找不到貨品
    { words: ['搵唔到', '找不到', '冷門', '冇貨', '缺貨', '冇啦', '斷貨', 'out of stock', '搵極都冇', '搵唔到貨', '無貨', '售罄', '賣晒'], reply: uiText[currentLang].r_no_product },
    
    // 13. 隱私與安全
    { words: ['個資', '隱私', '私隱', '安全', '個人資料', '保密', '資料', 'data', '泄露', '私隱條例', '安全嗎', '俾人偷', '私穩'], reply: uiText[currentLang].r_privacy },
    
    // 14. 價格提示/鬧鐘
    { words: ['提示', '鐘仔', 'alert', '追蹤', '到價', '通知', 'notify', 'notification', '鬧鐘', '提我', '降價', '減價', '平咗', 'mark低'], reply: uiText[currentLang].r_alert },
    
    // 15. 差價與抵買度 (加入極具香港超市特色的格價字眼)
    { words: ['差價', '激抵', '唔抵', '貴', '便宜', '呃錢', '水魚', '好貴', '平', '抵買', '抵到爛', '最平', '最抵', '搵笨', '海鮮價', '暴利'], reply: uiText[currentLang].r_gap },
    
    // 16. App 安裝與主畫面
    { words: ['畫面', '主螢幕', '安裝', '桌面', '加落去', 'app', '下載', 'download', '主頁', '捷徑', 'shortcut', 'pwa', '裝app', '裝機'], reply: uiText[currentLang].r_home }
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

//核心邏輯：統一處理意圖
function getIntentAndReply(q) {
    const low = q.toLowerCase().trim();
    
    // 檢查閒聊
    const match = categories.find(c => c.words.some(kw => low.includes(kw)));
    if (match) return { type: 'CHAT', reply: match.reply };
    
    // 否則視為搜尋
    return { type: 'SEARCH', query: q };
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
