// lang.js - 神器多語言及 AI 對答詞庫 (全面配對修正版)

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
        
        // 💬 廣東話口語化 AI 對答
        chatWelcome: "收到！你揀咗", 
        chatAsk: "想搵邊款貨品或者牌子呢？", 
        chatFound: "為你搜羅到以下最抵結果：", 
        chatShowAll: "呢個分類嘅全部貨品清單：", 
        chatNoResult: "哎呀，搵唔到相關貨品添！🤔 不如試吓縮短關鍵字，或者用其他字眼再搵過？",
        replyGreeting: "你好呀！我係你嘅專屬格價助手 🤖，有咩幫到你？", 
        replyThanks: "唔使客氣！最緊要幫你慳到錢！祝你掃貨開心！🛒✨",

        // 🚀 捷徑按鈕文字
        quickAll: "📦 睇晒全部",
        quickDiscount: "🏷️ 淨係睇有優惠",
        quickHome: "🏠 返主目錄",
        quickBye: "👋 拜拜"
    },
    
    'zh-Hans': { 
        title: "香港生活百货价格神器", 
        badge: "政府数据连线", 
        subLabel: "今日即时行情", 
        mainCat: "第一步：请选择主分类", 
        sortTip: "常用優先", 
        back: "返回", 
        loading: "努力同步最新价格...", 
        error: "加载失败", 
        send: "搜索", 
        placeholder: "输入商品、品牌或关键词...", 
        
        // 💬 自然流暢的簡體中文對答
        chatWelcome: "收到！您选择了", 
        chatAsk: "请问想找什么商品或品牌呢？", 
        chatFound: "为您搜索到以下比价结果：", 
        chatShowAll: "该分类下的全部商品清单：", 
        chatNoResult: "哎呀，找不到相关商品！🤔 不如尝试缩短关键词，或者换个字眼再搜搜看？",
        replyGreeting: "您好！我是您的专属比价助手 🤖，随时为您服务！", 
        replyThanks: "不客气！能帮您省钱就好！祝您购物愉快！🛒✨",

        quickAll: "📦 查看全部",
        quickDiscount: "🏷️ 只看有优惠",
        quickHome: "🏠 回主目录",
        quickBye: "👋 拜拜"
    },
    
    'en': { 
        title: "Price Navigator", 
        badge: "HK Open Data", 
        subLabel: "Live Daily Prices", 
        mainCat: "Step 1: Select Category", 
        sortTip: "Frequent First", 
        back: "Back", 
        loading: "Syncing live prices...", 
        error: "Failed to load", 
        send: "Search", 
        placeholder: "Type product, brand or keywords...", 
        
        // 💬 Professional & Friendly English
        chatWelcome: "Got it! You've selected", 
        chatAsk: "What product or brand are you looking for?", 
        chatFound: "Here are the best prices we found for you:", 
        chatShowAll: "Here is the full list of products in this category:", 
        chatNoResult: "Oops, we couldn't find any matching products! 🤔 Try using shorter or different keywords.",
        replyGreeting: "Hello there! I'm your personal Price Assistant 🤖. How can I help you today?", 
        replyThanks: "You're very welcome! Happy saving and happy shopping! 🛒✨",

        quickAll: "📦 Show All",
        quickDiscount: "🏷️ Discounted Only",
        quickHome: "🏠 Main Menu",
        quickBye: "👋 Goodbye"
    }
};

const supermarketDict = {
    'zh-Hant': { 'WELLCOME': '惠康', 'PARKNSHOP': '百佳', 'JASONS': 'Jasons', 'MARKETPLACE': 'Market Place', 'AEON': 'AEON', 'Watsons': '屈臣氏', 'MANNINGS': '萬寧', 'USELECT': 'U購', 'LUNGFUNG': '龍豐' },
    'zh-Hans': { 'WELLCOME': '惠康', 'PARKNSHOP': '百佳', 'JASONS': 'Jasons', 'MARKETPLACE': 'Market Place', 'AEON': 'AEON', 'Watsons': 'Watsons', 'MANNINGS': '万宁', 'USELECT': 'U购', 'LUNGFUNG': '龙丰' },
    'en': { 'WELLCOME': 'Wellcome', 'PARKNSHOP': 'PARKnSHOP', 'JASONS': 'Jasons', 'MARKETPLACE': 'Market Place', 'AEON': 'AEON', 'Watsons': 'Watsons', 'MANNINGS': 'Mannings', 'USELECT': 'U-Select', 'LUNGFUNG': 'Lung Fung' }
};