// lang.js - 神器多語言及 AI 對答詞庫

const uiText = {
    'zh-Hant': { 
        title: "香港生活百貨價格神器", 
        badge: "政府數據連線", 
        subLabel: "今日即時行情", 
        mainCat: "第一步：選擇主分類", 
        sortTip: "常用優先", 
        back: "返回", 
        loading: "讀取中...", 
        error: "載入失敗", 
        send: "搜尋", 
        placeholder: "搜尋貨品/牌子...", 
        chatWelcome: "您選擇了", 
        chatAsk: "想搵咩貨品？", 
        chatFound: "神器為您找到：", 
        chatShowAll: "所有貨品清單：", 
        chatNoResult: "搵唔到相關貨品，試下用其他字眼搜尋啦！",
        replyGreeting: "你好！我係格價助手 🤖，有咩幫到你？", 
        replyThanks: "唔使客氣！祝你掃貨買得最抵！🛒" 
    },
    'zh-Hans': { 
        title: "香港生活百货价格神器", 
        badge: "政府数据连线", 
        subLabel: "今日即时行情", 
        mainCat: "第一步：选择主分类", 
        sortTip: "常用優先", 
        back: "返回", 
        loading: "读取中...", 
        error: "加载失败", 
        send: "搜索", 
        placeholder: "搜索商品/品牌...", 
        chatWelcome: "您选择了", 
        chatAsk: "想找什么商品？", 
        chatFound: "神器为您找到：", 
        chatShowAll: "所有商品清单：", 
        chatNoResult: "找不到相关商品，试试用其他字眼搜索吧！",
        replyGreeting: "你好！我是比价助手 🤖，有什么能帮到你？", 
        replyThanks: "不用客气！祝你买得最划算！🛒" 
    },
    'en': { 
        title: "Price Navigator", 
        badge: "HK Open Data", 
        subLabel: "Live Daily Prices", 
        mainCat: "Step 1: Select Category", 
        sortTip: "Frequent First", 
        back: "Back", 
        loading: "Loading...", 
        error: "Failed", 
        send: "Search", 
        placeholder: "Type product or brand...", 
        chatWelcome: "Selected", 
        chatAsk: "What are you looking for?", 
        chatFound: "Found:", 
        chatShowAll: "Full List:", 
        chatNoResult: "No products found. Please try different keywords!",
        replyGreeting: "Hello! I am your AI Price Assistant 🤖. How can I help?", 
        replyThanks: "You're welcome! Happy shopping! 🛒" 
    }
};

const supermarketDict = {
    'zh-Hant': { 'WELLCOME': '惠康', 'PARKNSHOP': '百佳', 'JASONS': 'Jasons', 'MARKETPLACE': 'Market Place', 'AEON': 'AEON', 'Watsons': '屈臣氏', 'MANNINGS': '萬寧', 'USELECT': 'U購', 'LUNGFUNG': '龍豐' },
    'zh-Hans': { 'WELLCOME': '惠康', 'PARKNSHOP': '百佳', 'JASONS': 'Jasons', 'MARKETPLACE': 'Market Place', 'AEON': 'AEON', 'Watsons': '屈臣氏', 'MANNINGS': '万宁', 'USELECT': 'U购', 'LUNGFUNG': '龙丰' },
    'en': { 'WELLCOME': 'Wellcome', 'PARKNSHOP': 'PARKnSHOP', 'JASONS': 'Jasons', 'MARKETPLACE': 'Market Place', 'AEON': 'AEON', 'Watsons': 'Watsons', 'MANNINGS': 'Mannings', 'USELECT': 'U-Select', 'LUNGFUNG': 'Lung Fung' }
};
