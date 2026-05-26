// ocrEngine.js - 慳真D🔎 圖片辨識引擎 (Tesseract.js)

/**
 * 處理用戶上載 / 拍攝的圖片
 */
async function handleOcrUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. 顯示 AI 辨識中嘅 Loading 畫面
    showOcrLoading(true, "準備啟動 AI 引擎...");

    try {
        // 2. 呼叫 Tesseract.js 進行辨識 (同時加載 繁體中文 + 英文)
        const result = await Tesseract.recognize(
            file,
            'chi_tra+eng',
            {
                logger: m => {
                    // 監聽進度並更新 UI
                    if (m.status === 'recognizing text') {
                        const progress = (m.progress * 100).toFixed(0);
                        updateOcrProgress(`正在辨識包裝文字... ${progress}%`);
                    } else if (m.status === 'loading tesseract core' || m.status.includes('loading language')) {
                        updateOcrProgress(`正在載入 AI 語言庫... 請稍候`);
                    }
                }
            }
        );

        const rawText = result.data.text;
        console.log("📦 AI 原始讀取文字:", rawText);

        // 3. 經過大腦過濾器，抽走無謂字眼
        const cleanedText = filterOcrText(rawText);
        console.log("✨ 過濾後搜尋關鍵字:", cleanedText);

        if (cleanedText) {
            // 4. 將抽到嘅字自動填入 Search Bar，然後觸發搜尋
            document.getElementById('globalSearchInput').value = cleanedText;
            
            if (typeof triggerGlobalSearch === 'function') {
                triggerGlobalSearch();
            }

            // 顯示成功 Toast
            const successMsg = (typeof uiText !== 'undefined' && uiText[currentLang]?.ocrSuccess) 
                               ? uiText[currentLang].ocrSuccess 
                               : "✅ 辨識成功！自動為你搜尋。";
            if (typeof showToast === 'function') {
                // 如果你有自訂 toast 嘅功能，可以傳入 message，或者直接 showToast()
                alert(successMsg); // 暫時用 alert，你可以換返做你個靚靚 Toast
            }
        } else {
            // 認唔到字
            const errorMsg = (typeof uiText !== 'undefined' && uiText[currentLang]?.ocrError) 
                             ? uiText[currentLang].ocrError 
                             : "⚠️ 認唔到包裝上嘅字，請嘗試影得清楚啲！";
            alert(errorMsg);
        }

    } catch (error) {
        console.error("OCR 錯誤:", error);
        alert("圖片辨識發生錯誤，請重試！");
    } finally {
        // 5. 關閉 Loading 畫面，並清空 input 等佢可以再影同一件貨
        showOcrLoading(false);
        event.target.value = '';
    }
}

/**
 * 智能過濾器：清走包裝上的廢字，提取可能係牌子/貨品名的字
 */
function filterOcrText(text) {
    if (!text) return null;

    // 1. 移除多餘符號同換行，變做單行字串
    let clean = text.replace(/[\r\n]+/g, ' ');

    // 2. 建立包裝常見嘅「廢字字典」
    const junkWords = [
        '成分', '淨重', '重量', '此日期前最佳', 'best before', 'ingredients', 
        '營養資料', 'nutrition', 'kcal', '千卡', '蛋白質', '脂肪', '糖', '鈉', 
        '克', '毫升', 'g', 'ml', '產地', '香港', '製造', '包裝', '請存放於', '注意事項',
        '容量', '使用方法', 'www.', '.com', '.hk'
    ];
    
    // 將廢字過濾走
    junkWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        clean = clean.replace(regex, ' ');
    });

    // 3. 只保留 中文字、英文字母 同 數字，其他奇怪符號通通清走
    clean = clean.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');

    // 4. 將字串拆分為字詞陣列 (去除單個英文字母或單個中文字，因為通常無意義)
    let words = clean.trim().split(/\s+/).filter(w => w.length > 1);

    if (words.length === 0) return null;
    
    // 5. 攞最前面 2-3 個詞語組合 (通常貨品名/大字牌子會喺包裝最頂或者最明顯)
    // 攞太多字反而會令搜尋引擎搵唔到嘢
    let finalQuery = words.slice(0, 3).join(' ');
    
    return finalQuery;
}

/**
 * 控制 OCR 專屬 Loading 畫面
 */
function showOcrLoading(isShow, initialMsg = "處理中...") {
    let loader = document.getElementById('ocrLoaderOverlay');
    
    // 如果未有呢個 UI，就動態創造一個
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