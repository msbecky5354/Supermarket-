// lang.js - 神器多語言及 AI 對答詞庫//

const uiText = {
    'zh-Hant': { 
        title: "慳真D", 
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
        
        miniFooterLinks: "關於我們、條款及免責聲明",
        miniFooterCopy: "© 2026 慳真D",
        
        
        // 2. 免責聲明 (加入咗第2點「數據涵蓋範圍」)：
        disclaimerText: `<strong>1. 資料來源及知識產權：</strong><br>本應用程式之貨品價格及優惠數據取自政府資料一線通 (data.gov.hk) 的「網上價格一覽通」資料集。相關資料之知識產權擁有人為<strong>消費者委員會</strong>及相關商戶。<br><br><strong>2. 數據涵蓋範圍：</strong><br>系統數據主要涵蓋消委會挑選之數千款熱門「民生必需品」，並未包含實體超市之所有存貨（如部分獨家或冷門貨品）。<br><br><strong>3. 自動運算提示：</strong><br>系統顯示之<strong>「折合價」為程式自動運算之結果</strong>，所有資訊均以政府發佈之最新數據及實體超市最終標價為準。資訊僅供參考，強烈建議用戶購買前自行核實。<br><br><strong>4. 責任限制：</strong><br>本程式以「現況」形式提供，用戶須自行承擔風險。對於任何因使用、依賴本程式資訊，或因數據延遲、價格差異而引致之任何損失或損害，本應用程式及開發者概不承擔任何法律責任。`,

        // ======= 繁體中文 (zh-Hant) 部分 =======
        // 📥 舊有 disclaimer 三句已二合一成以下呢句終極防彈版文字
        //disclaimerText: `<strong>1. 資料來源及知識產權：</strong><br>本應用程式之貨品價格及優惠數據取自政府資料一線通 (data.gov.hk) 的「網上價格一覽通」資料集。相關資料之知識產權擁有人為<strong>消費者委員會</strong>及相關商戶。<br><br><strong>2. 自動運算提示：</strong><br>系統顯示之<strong>「折合價」為程式自動運算之結果</strong>，所有資訊均以政府發佈之最新數據及實體超市最終標價為準。資訊僅供參考，強烈建議用戶購買前自行核實。<br><br><strong>3. 責任限制：</strong><br>本程式以「現況」形式提供，用戶須自行承擔風險。對於任何因使用、依賴本程式資訊，或因數據延遲、價格差異而引致之任何損失或損害，本應用程式及開發者概不承擔任何法律責任。`,
        modalBtn: '我明白並接受',

        footerAbout: "關於我們",
        footerContact: "聯絡我們",
        footerPrivacy: "隱私權政策",
        footerTerms: "服務條款",
        
        aboutTitle: "關於 「慳真D🔎」",
        aboutContent: "「慳真D🔎」旨在為香港市民提供一個便捷的價格比較平台。<br><br>大家從此無需再下載及篩選繁複的政府 Excel 數據表，只需透過這個內置 AI 搜尋引擎的應用程式，即可輕鬆格價、秒速找出全港超市的最抵優惠與最低價格！",
        contactTitle: "聯絡我們",
        contactContent: "如有任何查詢或合作建議，歡迎聯絡我們。<br><br>（聯絡資料即將更新，敬請期待！）",
        privacyTitle: "隱私權政策",
        privacyContent: "我們重視您的隱私。本應用程式不會收集您的任何個人敏感資料或瀏覽紀錄。",
        termsTitle: "服務條款",
        termsContent: "本應用程式之價格及優惠數據均直接取自香港政府「資料一線通」(data.gov.hk) 之官方數據集。系統折合價為程式自動運算之結果，所有資訊均以政府每日發佈之最新數據為準。",

        // 🚀 新增：分享 App 彈窗文字
        shareAppTitle: "推薦「慳真D🔎」畀朋友！",
        shareAppDesc: "掃描下方 QR Code，或者複製連結分享畀親友，一齊慳到盡！",
        shareBtnCopy: "複製連結",
        shareBtnWhatsApp: "WhatsApp 分享",
        shareBtnMore: "更多選項",
        copiedToast: "✅ 連結已複製！",
        shareMessage: "推薦你用「慳真D🔎」！秒速格價，幫你慳到盡！🛒\n"
    },
    
    'zh-Hans': { 
        title: "悭真D", 
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
        
        miniFooterLinks: "關於我們、條款及免責聲明",
        miniFooterCopy: "© 2026 慳真D",
        
        // 2. 免責聲明：
        disclaimerText: `<strong>1. 资料来源及知识产权：</strong><br>本应用程式之货品价格及优惠数据取自政府资料一线通 (data.gov.hk) 的「网上价格一览通」数据集。相关资料之知识产权所有人为<strong>消费者委员会</strong>及相关商户。<br><br><strong>2. 数据涵盖范围：</strong><br>系统数据主要涵盖消委会挑选之数千款热门「民生必需品」，并未包含实体超市之所有存货（如部分独家或冷门货品）。<br><br><strong>3. 自动运算提示：</strong><br>系统显示之<strong>「折合价」为程序自动运算之结果</strong>，所有资讯均以政府发布之最新数据及实体超市最终标价为准。资讯仅供参考，强烈建议用户购买前自行核实。<br><br><strong>4. 责任限制：</strong><br>本程式以「现况」形式提供，用户须自行承担风险。对于任何因使用、依赖本程式资讯，或因数据延迟、价格差异而引致之任何损失或损害，本应用程式及开发者概不承担任何法律责任。`,

        // ======= 簡體中文 (zh-Hans) 部分 =======
        // 📥 舊有 disclaimer 三句已二合一成以下呢句终极防弹版文字
        //disclaimerText: `<strong>1. 资料来源及知识产权：</strong><br>本应用程式之货品价格及优惠数据取自政府资料一线通 (data.gov.hk) 的「网上价格一览通」数据集。相关资料之知识产权所有人为<strong>消费者委员会</strong>及相关商户。<br><br><strong>2. 自动运算提示：</strong><br>系统显示之<strong>「折合价」为程序自动运算之结果</strong>，所有资讯均以政府发布之最新数据及实体超市最终标价为准。资讯仅供参考，强烈建议用户购买前自行核实。<br><br><strong>3. 责任限制：</strong><br>本程式以「现况」形式提供，用户须自行承担风险。对于任何因使用、依赖本程式资讯，或因数据延迟、价格差异而引致之任何损失或损害，本应用程式及开发者概不承担任何法律责任。`,
        modalBtn: '我明白并接受',
        
        footerAbout: "关于我们",
        footerContact: "联络我们",
        footerPrivacy: "隐私权政策",
        footerTerms: "服务条款",
        
        aboutTitle: "关于 「慳真D🔎」",
        aboutContent: "「慳真D🔎」旨在为香港市民提供一个便捷的价格比较平台。<br><br>大家从此无需再下载及筛选繁复的政府 Excel 数据表，只需透过这个内置 AI 搜索引擎的应用程序，即可轻松比价、秒速找出全港超市的最划算优惠与最低价格！",
        contactTitle: "联络我们",
        contactContent: "如有任何查询或合作建议，欢迎联络我们。<br><br>（联络资料即将更新，敬请期待！）",
        privacyTitle: "隐私权政策",
        privacyContent: "我们重视您的隐私。本应用程序不会收集您的任何个人敏感资料或浏览纪录。",
        termsTitle: "服务条款",
        termsContent: "本应用程序之价格及优惠数据均直接取自香港政府「资料一线通」(data.gov.hk) 之官方数据集。系统折合价为程序自动运算之结果，所有信息均以政府每日发布之最新数据为准。",

        shareAppTitle: "推荐「慳真D🔎」给朋友！",
        shareAppDesc: "扫描下方 QR Code，或复制链接分享给亲友，一起省钱！",
        shareBtnCopy: "复制链接",
        shareBtnWhatsApp: "WhatsApp 分享",
        shareBtnMore: "更多选项",
        copiedToast: "✅ 链接已复制！",
        shareMessage: "推荐您使用「慳真D🔎」！秒速比价，帮您省到家！🛒\n"
    },
    
    'en': { 
        title: "HK Smart Price", 
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
        
        miniFooterLinks: "About, Terms & Disclaimer",
        miniFooterCopy: "© 2026 HK Smart Price",
        
        // 2. 免責聲明：
        disclaimerText: `<strong>1. Data Source & IP Rights:</strong><br>Price and promotional data in this app are sourced from the "Online Price Watch" dataset on Data.gov.hk. All intellectual property rights belong to the <strong>Consumer Council</strong> and respective merchants.<br><br><strong>2. Data Coverage:</strong><br>The dataset mainly covers thousands of popular daily essentials selected by the Consumer Council and does not include all supermarket inventory (such as exclusive or niche items).<br><br><strong>3. Automated Calculation:</strong><br>The calculated average prices displayed are <strong>automatically generated by the system</strong>. All information is based on the latest live data released by the government and final tags in physical stores. For reference only; users are advised to verify prices before purchasing.<br><br><strong>4. Limitation of Liability:</strong><br>This app is provided on an "AS IS" basis. Users assume all risks. The application and its developer shall not be held legally liable for any loss or damage arising from price differences, data delays, or reliance on the information provided.`,

        // ======= 英文 (en) 部分 =======
        //disclaimerText: `<strong>1. Data Source & IP Rights:</strong><br>Price and promotional data in this app are sourced from the "Online Price Watch" dataset on Data.gov.hk. All intellectual property rights belong to the <strong>Consumer Council</strong> and respective merchants.<br><br><strong>2. Automated Calculation:</strong><br>The calculated average prices displayed are <strong>automatically generated by the system</strong>. All information is based on the latest live data released by the government and final tags in physical stores. For reference only; users are advised to verify prices before purchasing.<br><br><strong>3. Limitation of Liability:</strong><br>This app is provided on an "AS IS" basis. Users assume all risks. The application and its developer shall not be held legally liable for any loss or damage arising from price differences, data delays, or reliance on the information provided.`,
        modalBtn: 'I Understand & Accept',

        footerAbout: "About Us",
        footerContact: "Contact Us",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Service",
        
        aboutTitle: "About HK Smart Price🔎",
        aboutContent: "HK Smart Price🔎 aims to provide a convenient price comparison platform for Hong Kong citizens.<br><br>Say goodbye to downloading and filtering complex government Excel sheets! With our AI-powered search app, you can effortlessly compare prices and find the best discounts across supermarkets in seconds.",
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
        shareMessage: "Check out the HK Smart Price Tracker🔎! Compare supermarket prices instantly and save money! 🛒\n"
    }
};
    
const supermarketDict = {
    'zh-Hant': { 
        'WELLCOME': '惠康', 
        'PARKNSHOP': '百佳', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'WATSONS': '屈臣氏', 
        'MANNINGS': '萬寧', 
        'USELECT': 'U購', 
        'LUNGFUNG': '龍豐',
        'DCHFOOD': '大昌食品',
        'SASA': '莎莎'
    },
    'zh-Hans': { 
        'WELLCOME': '惠康', 
        'PARKNSHOP': '百佳', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'WATSONS': '屈臣氏', 
        'MANNINGS': '万宁', 
        'USELECT': 'U购', 
        'LUNGFUNG': '龙丰',
        'DCHFOOD': '大昌食品',
        'SASA': '莎莎'
    },
    'en': { 
        'WELLCOME': 'Wellcome', 
        'PARKNSHOP': 'PARKnSHOP', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'WATSONS': 'Watsons', 
        'MANNINGS': 'Mannings', 
        'USELECT': 'U-Select', 
        'LUNGFUNG': 'Lung Fung',
        'DCHFOOD': 'DCH Food',
        'SASA': 'Sasa'
    }
};