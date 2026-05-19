// lang.js - 神器多語言及 AI 對答詞庫 (語法昇華版)

const uiText = {
    'zh-Hant': { 
        title: "香港生活百貨價格神器", 
        badge: "政府數據連線", 
        subLabel: "今日即時行情", 
        mainCat: "第一步：揀個主分類先", 
        sortTip: "常用優先", 
        back: "返回", 
        loading: "努力同步緊最新價格...", 
        error: "載入失敗", 
        send: "搵嘢", 
        placeholder: "輸入貨品、牌子或者關鍵字...", 
        chatWelcome: "收到！你揀咗", 
        chatAsk: "想搵邊款貨品或者牌子呢？", 
        chatFound: "為你搜羅到以下最抵結果：", 
        chatShowAll: "呢個分類嘅全部貨品清單：", 
        chatNoResult: "哎呀，搵唔到相關貨品添！🤔 不如試吓縮短關鍵字，或者用其他字眼再搵過？",
        replyGreeting: "你好呀！我係你嘅專屬格價助手 🤖，有咩幫到你？", 
        replyThanks: "唔使客氣！最緊要幫你慳到錢！祝你掃貨開心！🛒✨",
        // 👇 新增呢 4 行：
        btnOffers: "🏷️ 特價貨品", 
        btnClear: "🔄 顯示全部", 
        msgOffers: "為你找出以下特價貨品！🏷️", 
        msgClear: "已為你載入所有貨品！🔄"
    },
    
    'zh-Hans': { 
        title: "香港生活百货价格神器", 
        badge: "政府数据连线", 
        // ... (中間保持不變) ...
        replyGreeting: "您好！我是您的专属比价助手 🤖，随时为您服务！", 
        replyThanks: "不客气！能帮您省钱就好！祝您购物愉快！🛒✨",
        // 👇 新增呢 4 行：
        btnOffers: "🏷️ 特价货品", 
        btnClear: "🔄 显示全部", 
        msgOffers: "为您找出以下特价货品！🏷️", 
        msgClear: "已为您载入所有货品！🔄"
    },
    
    'en': { 
        title: "Price Navigator", 
        badge: "HK Open Data", 
        // ... (中間保持不變) ...
        replyGreeting: "Hello there! I'm your personal Price Assistant 🤖. How can I help you today?", 
        replyThanks: "You're very welcome! Happy saving and happy shopping! 🛒✨",
        // 👇 新增呢 4 行：
        btnOffers: "🏷️ Only Offers", 
        btnClear: "🔄 Show All", 
        msgOffers: "Here are the items currently on offer! 🏷️", 
        msgClear: "Showing all items! 🔄"
    }
};

const supermarketDict = {
    // ... (保持不變) ...
};