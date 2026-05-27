// searchEngine.js - 終極全網+分類智能搜尋版 (Ultimate Edition)

// ==========================================
// 🛠️ 1. 輔助工具 (Helper Functions)
// ==========================================
function normalizeStr(str) {
    return str ? str.toLowerCase().replace(/[^\w\s\u4e00-\u9fa5]/gi, '') : '';
}

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

// ==========================================
// 🧠 2. 閒聊與意圖識別大腦 (Small Talk & Intent)
// ==========================================
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

// ==========================================
// ⚖️ 3. 智能權重計分器 (解決 OCR 冗長字眼)
// ==========================================
// ==========================================
// ⚖️ 3. 智能權重計分器 (中英雙語強化版)
// ==========================================
function calculateRelevance(query, pName, brand) {
    let score = 0;
    let q = query.toLowerCase();
    let n = pName.toLowerCase();
    let b = (brand || '').toLowerCase();

    // 1. 牌子命中 (+50分)
    if (b && b.length > 1 && q.includes(b)) {
        score += 50;
        q = q.replace(b, ''); 
    }

    // 🌟 判斷係咪純英文搜尋 (包含字母、數字、空格)
    let isEnglish = /^[a-z0-9\s]+$/.test(q.trim());

    if (isEnglish) {
        // 🇺🇸 英文專用邏輯：按單字 (Word) 計算
        let words = q.trim().split(/\s+/); // 用空格切開單字
        words.forEach(word => {
            if (word.length >= 2 && n.includes(word)) {
                score += 20; // 命中一個完整單字 (例: "coca") 加 20 分
            }
        });
    } else {
        // 🇭🇰 中文專用邏輯：雙字切片 (Bigram)
        let matchedChunks = 0;
        for (let i = 0; i < q.length - 1; i++) {
            let chunk = q.substring(i, i + 2);
            if (n.includes(chunk)) {
                score += 15;
                matchedChunks++;
            }
        }
        // 單字保底
        if (matchedChunks === 0) {
            for (let char of q) {
                if (n.includes(char)) score += 2;
            }
        }
    }
    return score;
}

// ==========================================
// 🛒 4. 終極搜尋引擎 (動態支援：全網搜尋 + 分類搜尋)
// ==========================================
function performScopedSearch(query) {

    console.log("🔥 成功啟動新大腦！搜尋字眼：", query);
    const isDiscountOnly = (query === '__DISCOUNT_ONLY__');
    const rawQuery = query.trim().toLowerCase();
    
    if (isDiscountOnly) {
        currentKeyword = ''; 
    } else {
        currentKeyword = normalizeStr(query).trim();
        if (!currentKeyword && rawQuery) currentKeyword = rawQuery;
    }

    const isAll = ['所有', '全部', 'all', 'list','*'].some(kw => currentKeyword === normalizeStr(kw) || currentKeyword === kw) || (!currentKeyword && !isDiscountOnly);

    // 🛡️ 第一層：精準命中閒聊
    if (!isDiscountOnly) {
        let exactTalk = checkSmallTalk(rawQuery, true); 
        if (exactTalk) {
            addBotMessage(exactTalk);
            return; 
        }
    }

    // 🌟 動態設定搜尋範圍：全網 vs 分類
    let searchScope = {};
    if (typeof selectedCat1 !== 'undefined' && selectedCat1 && selectedCat1 !== 'all' && structuredData[selectedCat1]) {
        // 如果處於特定超市/分類，只搵嗰個分類 (Scoped)
        searchScope[selectedCat1] = structuredData[selectedCat1];
    } else {
        // 如果 selectedCat1 未定義或等於 'all'，自動啟動全網掃描 (Global)
        searchScope = structuredData;
    }

    // 🛡️ 第二層：執行硬搜尋 + 計分機制
    let html = '';
    let scoredProducts = []; 

    Object.keys(searchScope).forEach(cat1 => {
        Object.keys(searchScope[cat1]).forEach(cat2 => {
            Object.keys(searchScope[cat1][cat2]).forEach(pName => {
                const info = searchScope[cat1][cat2][pName];
                const hasDiscount = info.prices.some(p => p.promoDisplay || p.promoCalc);
                
                const matchesKeyword = isAll || info.searchKeywords.includes(currentKeyword);
                const matchesDiscount = !isDiscountOnly || hasDiscount;
                
                if (matchesDiscount) {
                    if (matchesKeyword) {
                        // 100% 完美命中
                        html += generateProductCardHTML(pName, info); 
                    } else if (!isAll && currentKeyword.length >= 2) {
                        // 啟動漏斗式計分
                        let score = calculateRelevance(currentKeyword, pName, info.brand);
                        if (score > 20) {
                            scoredProducts.push({ name: pName, info: info, score: score });
                        }
                    }
                }
            });
        });
    });
    
    if (!html) {
        // 🛡️ 第三層：模糊命中閒聊
        let fuzzyTalk = null;
        if (!isDiscountOnly) {
            fuzzyTalk = checkSmallTalk(rawQuery, false); 
        }
        
        if (fuzzyTalk) {
            addBotMessage(fuzzyTalk);
        } else if (scoredProducts.length > 0) {
            // ==========================================
            // 🚀 智能救場：出最高分貨品 (適用於全網及分類)
            // ==========================================
            scoredProducts.sort((a, b) => b.score - a.score);
            let topMatches = scoredProducts.slice(0, 4); 
            
            let rescueHtml = '';
            topMatches.forEach(match => {
                rescueHtml += generateProductCardHTML(match.name, match.info);
            });

            let fallbackMsg = (currentLang === 'en') 
                ? `Cannot find the exact match for "${rawQuery}", but here are the most relevant products:` 
                : (currentLang === 'zh-Hans') 
                ? `找不到「${rawQuery}」的完全匹配，但我为您找到最相关的产品：` 
                : `搵唔到「${rawQuery}」嘅完全匹配喎，但我幫你搵到最相關嘅產品：`;
            
            addBotMessage(fallbackMsg, rescueHtml);
        } else {
            // 🛡️ 第四層：真係咩都搵唔到 (Fallback建議)
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
