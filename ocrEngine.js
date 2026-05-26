// ocrEngine.js - 慳真D🔎 圖片辨識引擎 (神級反向比對版 + 超市語境防呆)

async function handleOcrUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showOcrLoading(true, "準備啟動 AI 引擎...");

    try {
        const result = await Tesseract.recognize(
            file,
            'chi_tra+chi_sim+eng',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = (m.progress * 100).toFixed(0);
                        updateOcrProgress(`正在辨識包裝文字... ${progress}%`);
                    } else if (m.status === 'loading tesseract core' || m.status.includes('loading language')) {
                        updateOcrProgress(`正在載入 AI 語言庫...`);
                    }
                }
            }
        );

        const rawText = result.data.text;
        console.log("📦 AI 原始讀取文字:\n", rawText);

        // 🧠 進入智能過濾大腦
        const cleanedText = smartExtractKeyword(rawText);
        console.log("✨ 智能過濾後最終關鍵字:", cleanedText);

        if (cleanedText) {
            // 決定將字放落邊個 Input Box (主頁 or Chat 頁)
            const chatInput = document.getElementById('chatInput');
            const globalInput = document.getElementById('globalSearchInput');
            const chatSection = document.getElementById('chatSection');

            let targetInput = globalInput;
            if (chatSection && !chatSection.classList.contains('hidden')) {
                targetInput = chatInput; // 如果喺 Chat 畫面，就塞入 Chat Input
            }

            if (targetInput) {
                targetInput.value = cleanedText;
                targetInput.focus(); // 自動 Focus 等用家可以即刻改字
            }

            // ⚠️ 抽起自動搜尋，改為半自動！
            const successMsg = (typeof uiText !== 'undefined' && uiText[currentLang]?.ocrSuccess) 
                               ? uiText[currentLang].ocrSuccess 
                               : "✅ 辨識完成！請確認字眼後再按下搜尋。";
            alert(successMsg);

        } else {
            const errorMsg = (typeof uiText !== 'undefined' && uiText[currentLang]?.ocrError) 
                             ? uiText[currentLang].ocrError 
                             : "⚠️ 認唔到包裝上嘅字，請嘗試影得清楚啲！";
            alert(errorMsg);
        }

    } catch (error) {
        console.error("OCR 錯誤:", error);
        alert("圖片辨識發生錯誤，請重試！");
    } finally {
        showOcrLoading(false);
        event.target.value = '';
    }
}

// 🛒 超市常見商品關鍵詞白名單（可持續擴充）
// 用嚟過濾 OCR 誤認出嘅荒謬詞語（例如「夫婦」）
const GROCERY_WHITELIST = new Set([
    // 食品大類
    '肉', '肉類', '豬肉', '牛肉', '雞肉', '羊肉', '魚', '海鮮', '蝦', '蟹',
    '菜', '蔬菜', '生果', '水果', '蛋', '奶', '鮮奶', '豆漿', '豆腐',
    '米', '飯', '麵', '麵包', '麥片', '餅乾', '零食', '糖果', '朱古力',
    '油', '鹽', '糖', '豉油', '醬油', '醋', '蠔油', '調味料', '罐頭',
    '湯', '即食麵', '杯麵', '叮叮飯', '急凍', '冷藏', '雪糕', '乳酪',
    // 飲品
    '水', '汽水', '可樂', '果汁', '茶', '咖啡', '啤酒', '紅酒', '白酒',
    // 日用品
    '紙巾', '廁紙', '洗潔精', '洗衣液', '沐浴露', '洗頭水', '牙膏', '牙刷',
    // 常見包裝字眼（有時 OCR 會單獨認到）
    '有機', '無添加', '低脂', '全脂', '脫脂', '高鈣', '無糖', '原味',
    // 其他你可能需要嘅字
    '香港', '製造', '進口', '新鮮', '急凍'
]);

// 檢查一個詞係咪同超市/食品有關聯
function isGroceryRelated(word) {
    if (!word) return false;
    // 直接命中白名單
    if (GROCERY_WHITELIST.has(word)) return true;
    // 如果係單字，檢查係咪存在於白名單入面嘅任何複合詞中
    if (word.length === 1) {
        for (let item of GROCERY_WHITELIST) {
            if (item.includes(word)) return true;
        }
    }
    // 進一步放寬：對於2-3字詞，如果其中任何一個字喺白名單嘅詞入面出現，都當係相關
    // (避免「夫婦」呢類完全無超市關聯嘅詞通過)
    if (word.length >= 2 && word.length <= 3) {
        const chars = word.split('');
        for (let char of chars) {
            for (let item of GROCERY_WHITELIST) {
                if (item.includes(char)) return true;
            }
        }
    }
    return false;
}

/**
 * 智能過濾器：反向對比資料庫 + 清洗垃圾字 + 超市語境把關
 */
function smartExtractKeyword(rawText) {
    if (!rawText) return null;

    // 1. 神級必殺技：資料庫反向比對 (Reverse Lookup)
    // 直接攞張相啲字，同我哋手頭上嘅「政府超市數據庫」對比！
    try {
        if (typeof window !== 'undefined' && window.rawApiData && window.rawApiData.length > 0) {
            let lowerRaw = rawText.toLowerCase().replace(/\s+/g, '');
            let bestBrand = "";

            for (let item of window.rawApiData) {
                let brandObj = item.brand || item.brandName;
                let brand = (typeof brandObj === 'object') ? (brandObj['zh-Hant'] || brandObj['zh-Hans'] || brandObj['en'] || '') : (brandObj || '');
                
                if (brand && brand.length > 1) {
                    let cleanBrand = brand.toLowerCase().replace(/\s+/g, '');
                    // 如果 AI 掃到嘅一大堆垃圾字入面，竟然包含咗資料庫入面嘅某個牌子名！
                    if (lowerRaw.includes(cleanBrand)) {
                        if (brand.length > bestBrand.length) {
                            bestBrand = brand; // 搵出最長、最精準嗰個牌子
                        }
                    }
                }
            }
            if (bestBrand) {
                console.log("🎯 資料庫完美命中牌子:", bestBrand);
                return bestBrand; // 直接回傳命中嘅牌子，無視其他垃圾字！
            }
        }
    } catch (e) {
        console.warn("資料庫反向比對發生錯誤，跳過。", e);
    }

    // 2. 如果資料庫無命中，先用返基礎過濾器
    let clean = rawText.replace(/[\r\n]+/g, ' ');
    const junkWords = [
        '成分', '淨重', '重量', '此日期前最佳', 'best before', 'ingredients', 
        '營養資料', 'nutrition', 'kcal', '千卡', '蛋白質', '脂肪', '糖', '鈉', 
        '克', '毫升', 'g', 'ml', '產地', '香港', '製造', '包裝', '請存放於', '注意事項',
        '容量', '使用方法', 'www.', '.com', '.hk', 'mannings' // 加埋萬寧做廢字，避免干擾牌子
    ];
    
    junkWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        clean = clean.replace(regex, ' ');
    });

    clean = clean.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');

    let words = clean.trim().split(/\s+/).filter(w => {
        // 🛑 終極殺手：殺死 1-3 個字母嘅無謂英文 (通常係條碼、陰影雜訊，或者 ply, es 等廢字)
        if (/^[a-zA-Z]{1,3}$/.test(w)) return false;
        return w.length > 1;
    });

    if (words.length === 0) return null;

    // 🌟 新加入：超市語境過濾，踢走 OCR 亂認嘅詞（例如「夫婦」）
    let validWords = words.filter(w => isGroceryRelated(w));
    if (validWords.length === 0) {
        console.log("🚫 所有候選詞都唔似係超市相關，OCR 可能誤認，回傳 null");
        return null; // 寧願話認唔到，都好過出怪字
    }
    // 用過濾後嘅詞繼續
    words = validWords;
    
    // 優先抽取「中文字」，因為香港超市貨品搜中文最準
    let chineseWords = words.filter(w => /[\u4e00-\u9fa5]/.test(w));
    if (chineseWords.length > 0) {
        return chineseWords.slice(0, 2).join(' ');
    } else {
        // 如果真係無中文，就攞最長嘅英文字
        words.sort((a, b) => b.length - a.length);
        return words.slice(0, 2).join(' ');
    }
}

/**
 * 控制 OCR 專屬 Loading 畫面
 */
function showOcrLoading(isShow, initialMsg = "處理中...") {
    let loader = document.getElementById('ocrLoaderOverlay');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'ocrLoaderOverlay';
        loader.className = 'fixed inset-0 bg-slate-900/60 z-[200] hidden flex flex-col items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        loader.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-[280px] w-full shadow-2xl flex flex-col items-center text-center">
                <div class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <h3 class="text-[16px] font-black text-slate-800 dark:text-slate-100 mb-2">📷 AI 視覺辨識中</h3>
                <p id="ocrLoaderText" class="text-[13px] text-slate-500 dark:text-slate-400 font-bold">${initialMsg}</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    const textEl = document.getElementById('ocrLoaderText');
    if (textEl) textEl.innerText = initialMsg;

    if (isShow) {
        loader.classList.remove('hidden');
        setTimeout(() => loader.classList.remove('opacity-0'), 10);
    } else {
        loader.classList.add('opacity-0');
        setTimeout(() => loader.classList.add('hidden'), 300);
    }
}

function updateOcrProgress(msg) {
    const textEl = document.getElementById('ocrLoaderText');
    if (textEl) textEl.innerText = msg;
}