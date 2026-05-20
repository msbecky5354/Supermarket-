// lang.js - 神器多語言及 AI 對答詞庫/

const uiText = {
    'zh-Hant': { 
        title: "香港生活百貨價格神器", 
        badge: "政府數據連線", 
        subLabel: "正在讀取更新時間...", 
        lastUpdated: "更新於: ",
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
        
        replyGreeting: "你好呀！我係你嘅專屬格價助手 🤖，今日想買啲咩？", 
        replyThanks: "唔使客氣！幫你慳到錢我都好開心！🛒✨",
        replyBye: "拜拜！有買貴冇買錯，下次去超市掃貨前記得再搵我格價呀！👋",
        replyPraise: "多謝讚賞！😎 我會繼續努力𥄫實各大超市嘅最新靚價！",
        replyJoke: "點解去超市買嘢要帶計數機？...因為要計住啲神仙（仙=cents）！😆 好啦，爛Gag講完，有咩想搵？",

        quickAll: "📦 睇晒全部",
        quickDiscount: "🏷️ 淨係睇有優惠",
        quickHome: "🏠 返主目錄",
        quickBye: "👋 拜拜",

        disclaimerGovData: "本應用程式之貨品價格及優惠數據<br>取自政府資料一線通 (data.gov.hk) 的<br><strong class='text-slate-700'>「網上價格一覽通」</strong>資料集。",
        disclaimerOwner: "知識產權擁有人：<strong class='text-slate-600'>消費者委員會</strong>",
        disclaimerNote: "免責聲明：系統折合價為程式自動運算之結果，所有資訊均以政府發佈之最新數據為準。",

        footerAbout: "關於我們",
        footerContact: "聯絡我們",
        footerPrivacy: "隱私權政策",
        footerTerms: "服務條款",
        
        aboutTitle: "關於 價格神器",
        aboutContent: "「香港生活百貨價格神器」旨在為香港市民提供一個便捷的價格比較平台。<br><br>大家從此無需再下載及篩選繁複的政府 Excel 數據表，只需透過這個內置 AI 搜尋引擎的應用程式，即可輕鬆格價、秒速找出全港超市的最抵優惠與最低價格！",
        contactTitle: "聯絡我們",
        contactContent: "如有任何查詢或合作建議，歡迎聯絡我們。<br><br>（聯絡資料即將更新，敬請期待！）",
        privacyTitle: "隱私權政策",
        privacyContent: "我們重視您的隱私。本應用程式不會收集您的任何個人敏感資料或瀏覽紀錄。",
        termsTitle: "服務條款",
        termsContent: "本應用程式之價格及優惠數據均直接取自香港政府「資料一線通」(data.gov.hk) 之官方數據集。系統折合價為程式自動運算之結果，所有資訊均以政府每日發佈之最新數據為準。",

        // 🚀 新增：分享 App 彈窗文字
        shareAppTitle: "推薦「價格神器」畀朋友！",
        shareAppDesc: "掃描下方 QR Code，或者複製連結分享畀親友，一齊慳到盡！",
        shareBtnCopy: "複製連結",
        shareBtnWhatsApp: "WhatsApp 分享",
        shareBtnMore: "更多選項",
        copiedToast: "✅ 連結已複製！",
        shareMessage: "推薦你用「香港生活百貨價格神器」！秒速格價，幫你慳到盡！🛒\n"
    },
    
    'zh-Hans': { 
        title: "香港生活百货价格神器", 
        badge: "政府数据连线", 
        subLabel: "正在读取更新时间...", 
        lastUpdated: "更新于: ",
        mainCat: "第一步：请选择主分类", 
        sortTip: "常用優先", 
        back: "返回", 
        loading: "努力同步最新价格...", 
        error: "加载失败", 
        send: "搜索", 
        placeholder: "输入商品、品牌或关键词...", 
        
        chatWelcome: "收到！您选择了", 
        chatAsk: "请问想找什么商品或品牌呢？", 
        chatFound: "为您搜索到以下比价结果：", 
        chatShowAll: "该分类下的全部商品清单：", 
        chatNoResult: "哎呀，找不到相关商品！🤔 不如尝试缩短关键词，或者换个字眼再搜搜看？",
        
        replyGreeting: "您好！我是您的专属比价助手 🤖，今天想买点什么？", 
        replyThanks: "不客气！能帮您省钱就好！🛒✨",
        replyBye: "拜拜！下次去超市前记得再找我比价哦！👋",
        replyPraise: "谢谢夸奖！😎 我会继续努力帮您盯紧最新的价格！",
        replyJoke: "去超市买东西最怕什么？最怕排错结账队伍！😆 好了，言归正传，想找点什么？",

        quickAll: "📦 查看全部",
        quickDiscount: "🏷️ 只看有优惠",
        quickHome: "🏠 回主目录",
        quickBye: "👋 拜拜",

        disclaimerGovData: "本应用程序之货品价格及优惠数据<br>取自政府资料一线通 (data.gov.hk) 的<br><strong class='text-slate-700'>「网上价格一览通」</strong>数据集。",
        disclaimerOwner: "知识产权所有人：<strong class='text-slate-600'>消费者委员会</strong>",
        disclaimerNote: "免责声明：系统折合价为程序自动运算之结果，所有信息均以政府发布之最新数据为准。",

        footerAbout: "关于我们",
        footerContact: "联络我们",
        footerPrivacy: "隐私权政策",
        footerTerms: "服务条款",
        
        aboutTitle: "关于 价格神器",
        aboutContent: "「香港生活百货价格神器」旨在为香港市民提供一个便捷的价格比较平台。<br><br>大家从此无需再下载及筛选繁复的政府 Excel 数据表，只需透过这个内置 AI 搜索引擎的应用程序，即可轻松比价、秒速找出全港超市的最划算优惠与最低价格！",
        contactTitle: "联络我们",
        contactContent: "如有任何查询或合作建议，欢迎联络我们。<br><br>（联络资料即将更新，敬请期待！）",
        privacyTitle: "隐私权政策",
        privacyContent: "我们重视您的隐私。本应用程序不会收集您的任何个人敏感资料或浏览纪录。",
        termsTitle: "服务条款",
        termsContent: "本应用程序之价格及优惠数据均直接取自香港政府「资料一线通」(data.gov.hk) 之官方数据集。系统折合价为程序自动运算之结果，所有信息均以政府每日发布之最新数据为准。",

        shareAppTitle: "推荐「价格神器」给朋友！",
        shareAppDesc: "扫描下方 QR Code，或复制链接分享给亲友，一起省钱！",
        shareBtnCopy: "复制链接",
        shareBtnWhatsApp: "WhatsApp 分享",
        shareBtnMore: "更多选项",
        copiedToast: "✅ 链接已复制！",
        shareMessage: "推荐您使用「香港生活百货价格神器」！秒速比价，帮您省到家！🛒\n"
    },
    
    'en': { 
        title: "HK Smart Price Tracker", 
        badge: "HK Open Data", 
        subLabel: "Fetching update time...", 
        lastUpdated: "Updated: ",
        mainCat: "Step 1: Select Category", 
        sortTip: "Frequent First", 
        back: "Back", 
        loading: "Syncing live prices...", 
        error: "Failed to load", 
        send: "Search", 
        placeholder: "Type product, brand or keywords...", 
        
        chatWelcome: "Got it! You've selected", 
        chatAsk: "What product or brand are you looking for?", 
        chatFound: "Here are the best prices we found for you:", 
        chatShowAll: "Here is the full list of products in this category:", 
        chatNoResult: "Oops, we couldn't find any matching products! 🤔 Try using shorter or different keywords.",
        
        replyGreeting: "Hello there! I'm your personal Price Assistant 🤖. What are we shopping for today?", 
        replyThanks: "You're very welcome! Happy saving and happy shopping! 🛒✨",
        replyBye: "Goodbye! Catch you later. Remember to check prices here before your next shopping trip! 👋",
        replyPraise: "Thanks for the compliment! 😎 I'll keep tracking the best deals for you.",
        replyJoke: "Why did the tomato blush? Because it saw the salad dressing! 🍅😆 Alright, back to business, what are we looking for?",

        quickAll: "📦 Show All",
        quickDiscount: "🏷️ Discounted Only",
        quickHome: "🏠 Main Menu",
        quickBye: "👋 Goodbye",

        disclaimerGovData: "Price and promotional data in this app are sourced from the<br><strong class='text-slate-700'>「Online Price Watch」</strong> dataset<br>on Data.gov.hk.",
        disclaimerOwner: "Intellectual Property Owner: <strong class='text-slate-600'>Consumer Council</strong>",
        disclaimerNote: "Disclaimer: Calculated prices are automatically generated. All information is based on the latest government data.",

        footerAbout: "About Us",
        footerContact: "Contact Us",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Service",
        
        aboutTitle: "About HK Smart Price Tracker",
        aboutContent: "HK Smart Price Tracker aims to provide a convenient price comparison platform for Hong Kong citizens.<br><br>Say goodbye to downloading and filtering complex government Excel sheets! With our AI-powered search app, you can effortlessly compare prices and find the best discounts across supermarkets in seconds.",
        contactTitle: "Contact Us",
        contactContent: "For inquiries or collaborations, please feel free to reach out.<br><br>(Contact info coming soon!)",
        privacyTitle: "Privacy Policy",
        privacyContent: "We value your privacy. This application does not collect any sensitive personal data or browsing history.",
        termsTitle: "Terms of Service",
        termsContent: "All price and promotional data are directly sourced from the official 'Data.gov.hk' dataset provided by the Hong Kong Government. The calculated average prices are automatically generated by the system. All information is based on the latest daily data released by the government.",

        shareAppTitle: "Share with Friends!",
        shareAppDesc: "Scan the QR Code below or copy the link to share the savings with your friends and family!",
        shareBtnCopy: "Copy Link",
        shareBtnWhatsApp: "WhatsApp",
        shareBtnMore: "More Options",
        copiedToast: "✅ Link copied to clipboard!",
        shareMessage: "Check out the HK Smart Price Tracker! Compare supermarket prices instantly and save money! 🛒\n"
    }
};
    
const supermarketDict = {
    'zh-Hant': { 
        'WELLCOME': '惠康', 
        'PARKNSHOP': '百佳', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'Watsons': '屈臣氏', 
        'MANNINGS': '萬寧', 
        'USELECT': 'U購', 
        'LUNGFUNG': '龍豐',
        '1DCHFOOD': '大昌食品' 
    },
    'zh-Hans': { 
        'WELLCOME': '惠康', 
        'PARKNSHOP': '百佳', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'Watsons': 'Watsons', 
        'MANNINGS': '万宁', 
        'USELECT': 'U购', 
        'LUNGFUNG': '龙丰',
        '1DCHFOOD': '大昌食品' 
    },
    'en': { 
        'WELLCOME': 'Wellcome', 
        'PARKNSHOP': 'PARKnSHOP', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'Watsons': 'Watsons', 
        'MANNINGS': 'Mannings', 
        'USELECT': 'U-Select', 
        'LUNGFUNG': 'Lung Fung',
        'DCHFOOD': 'DCH Food' 
    }
};