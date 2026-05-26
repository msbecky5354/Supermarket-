// ocrEngine.js - 慳真D🔎 雙核圖片辨識引擎 (Gemini Pro + Tesseract 多語言智能版)

async function handleOcrUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 檢查有冇 Gemini API Key
    const geminiKey = localStorage.getItem('gemini_api_key');

    if (geminiKey) {
        // ==========================================
        // 🚀 PRO 模式：召喚 Google Gemini
        // ==========================================
        const msg = getUiDict().ocrLoadingGemini || "召喚 Gemini AI 視覺大腦...";
        showOcrLoading(true, msg);
        try {
            const finalKeyword = await callGeminiVision(file, geminiKey);
            if (finalKeyword) {
                fillInputAndAlert(finalKeyword, true);
            } else {
                showFailAlert(true);
            }
        } catch (error) {
            console.error("Gemini 錯誤:", error);
            const errMsg = getUiDict().ocrErrorGemini || "Gemini 連線失敗，請檢查 API Key 是否正確！系統將暫時退回基礎模式。";
            alert(errMsg);
        } finally {
            showOcrLoading(false);
            event.target.value = ''; // 清空 input
        }

    } else {
        // ==========================================
        // 🐢 基礎模式：Tesseract + 智能過濾
        // ==========================================
        const msg = getUiDict().ocrLoadingBasic || "準備啟動基礎 AI 引擎...";
        showOcrLoading(true, msg);
        try {
            const result = await Tesseract.recognize(
                file,
                'chi_tra+chi_sim+eng',
                {
                    logger: m => {
                        const dict = getUiDict();
                        if (m.status === 'recognizing text') {
                            const progressMsg = dict.ocrProgress || "正在辨識包裝文字...";
                            updateOcrProgress(`${progressMsg} ${(m.progress * 100).toFixed(0)}%`);
                        } else if (m.status.includes('loading')) {
                            const loadLangMsg = dict.ocrLoadingLang || "正在載入 AI 語言庫...";
                            updateOcrProgress(loadLangMsg);
                        }
                    }
                }
            );

            const rawText = result.data.text;
            console.log("📦 基礎模式原始文字:\n", rawText);

            const cleanedText = smartExtractKeyword(rawText);
            console.log("✨ 基礎模式過濾結果:", cleanedText);

            if (cleanedText) {
                fillInputAndAlert(cleanedText, false);
            } else {
                showFailAlert(false);
            }
        } catch (error) {
            console.error("OCR 錯誤:", error);
            const errMsg = getUiDict().ocrErrorBasic || "圖片辨識引擎啟動失敗！請檢查網絡連線或等一陣再試。";
            alert(errMsg);
        } finally {
            showOcrLoading(false);
            event.target.value = ''; 
        }
    }
}

// ==========================================
// 🎯 UI 輔助：自動填字與多語言提示
// ==========================================
function getUiDict() {
    return (typeof uiText !== 'undefined' && typeof currentLang !== 'undefined' && uiText[currentLang]) ? uiText[currentLang] : {};
}

function fillInputAndAlert(keyword, isGemini) {
    const chatInput = document.getElementById('chatInput');
    const globalInput = document.getElementById('globalSearchInput');
    const chatSection = document.getElementById('chatSection');

    let targetInput = globalInput;
    if (chatSection && !chatSection.classList.contains('hidden')) {
        targetInput = chatInput; 
    }

    if (targetInput) {
        targetInput.value = keyword;
        targetInput.focus();
    }

    const dict = getUiDict();
    let successMsg = isGemini 
        ? (dict.ocrSuccessGemini || "🎯 Gemini 完美辨識完成！請確認字眼後按下搜尋。") 
        : (dict.ocrSuccessBasic || "✅ 辨識完成！請確認字眼後再按下搜尋掣。");
        
    alert(successMsg);
}

function showFailAlert(isGemini) {
    const dict = getUiDict();
    let errorMsg = isGemini
        ? (dict.ocrFailGemini || "⚠️ Gemini 認唔到相關嘅貨品名，請對準包裝再影多一次！")
        : (dict.ocrFailBasic || "⚠️ AI 認唔到相關嘅貨品名，請對準包裝上嘅「大字牌子」或「中文字」再影多一次！");
    alert(errorMsg);
}

// ==========================================
// 🧠 Gemini 核心運算
// ==========================================
async function callGeminiVision(file, apiKey) {
    let modelName = "gemini-2.5-flash"; 
    try {
        const modelRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelData = await modelRes.json();
        if (modelData.models) {
            const available = modelData.models.map(m => m.name.replace('models/', ''));
            const flashModels = available.filter(m => m.includes('flash') && !m.includes('exp'));
            if (flashModels.length > 0) {
                flashModels.sort();
                modelName = flashModels[flashModels.length - 1]; 
            } else if (available.length > 0) {
                modelName = available.find(m => m.includes('gemini')) || available[0];
            }
        }
    } catch (e) { console.warn("無法獲取模型清單，強制使用兜底模型"); }

    const base64Image = await fileToBase64(file);
    const promptText = `你是一個香港超市格價專家。請查看這張包裝圖片，並直接提取產品的「品牌名稱」與「核心產品名」。例如：維他檸檬茶、善存男士50+。請直接輸出最終的中文搜尋關鍵字，不要輸出任何解釋或成分表。`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: promptText },
                    { inlineData: { mimeType: file.type, data: base64Image.split(',')[1] } }
                ]
            }]
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(`${data.error.code} - ${data.error.message}`);
    return data.candidates[0].content.parts[0].text.trim();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// ==========================================
// 🛡️ Tesseract 防呆邏輯 (基礎模式)
// ==========================================
const GROCERY_WHITELIST = new Set([
    '肉', '豬肉', '牛肉', '雞肉', '魚', '海鮮', '蝦', '蟹', '菜', '蔬菜', '生果', '水果', 
    '蛋', '奶', '鮮奶', '豆漿', '豆腐', '維他奶', '米', '飯', '麵', '麵包', '麥片', '餅乾', 
    '零食', '糖果', '朱古力', '油', '鹽', '糖', '豉油', '醬油', '醋', '蠔油', '調味料', '罐頭',
    '湯', '即食麵', '杯麵', '叮叮飯', '急凍', '冷藏', '雪糕', '乳酪', '水', '汽水', '可樂', 
    '果汁', '茶', '咖啡', '啤酒', '紅酒', '白酒', '紙巾', '廁紙', '洗潔精', '洗衣液', '沐浴露', 
    '洗頭水', '牙膏', '牙刷', '維他命', '保健品', '善存', '男士', '女士', '丸', '膠囊', '精華',
    'mannings', 'watsons', 'parknshop', 'wellcome', 'tissue', 'paper', 'milk', 'water', 
    'tea', 'coffee', 'juice', 'noodle', 'rice', 'oil', 'kitty', 'sanrio', 'vita', 'vlt'
]);

function isGroceryRelated(word) {
    if (!word) return false;
    let lowerWord = word.toLowerCase(); 
    for (let item of GROCERY_WHITELIST) {
        if (lowerWord.includes(item.toLowerCase()) || item.toLowerCase().includes(lowerWord)) return true;
    }
    return false;
}

function smartExtractKeyword(rawText) {
    if (!rawText) return null;
    let lowerRaw = rawText.toLowerCase().replace(/\s+/g, '');
    if (lowerRaw.includes('vlt') || (lowerRaw.includes('vita') && lowerRaw.includes('lemon'))) return "維他檸檬茶";
    if (lowerRaw.includes('kitty') && lowerRaw.includes('tissue')) return "Hello Kitty 紙巾";

    try {
        let dbData = typeof rawApiData !== 'undefined' ? rawApiData : (window.rawApiData || []);
        if (dbData && dbData.length > 0) {
            let bestBrand = "";
            for (let item of dbData) {
                let brandObj = item.brand || item.brandName;
                let brand = (typeof brandObj === 'object') ? (brandObj['zh-Hant'] || brandObj['zh-Hans'] || brandObj['en'] || '') : (brandObj || '');
                if (brand && brand.length > 1) {
                    let cleanBrand = brand.toLowerCase().replace(/\s+/g, '');
                    if (lowerRaw.includes(cleanBrand)) {
                        if (brand.length > bestBrand.length) bestBrand = brand; 
                    }
                }
            }
            if (bestBrand) return bestBrand; 
        }
    } catch (e) { console.warn(e); }

    let clean = rawText.replace(/[\r\n]+/g, ' ');
    const junkWords = ['成分', '淨重', '重量', 'best before', 'ingredients', 'nutrition', 'kcal', '千卡', '蛋白質', '脂肪', '糖', '鈉', '克', '毫升', 'g', 'ml', '產地', '製造', '包裝', '請存放於', '注意事項', '容量', '使用方法', 'www.', '.com', '.hk'];
    junkWords.forEach(word => { clean = clean.replace(new RegExp(word, 'gi'), ' '); });
    clean = clean.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');

    let words = clean.trim().split(/\s+/).filter(w => {
        if (/^[a-zA-Z]+$/.test(w)) return w.length >= 3;
        return w.length >= 1; 
    });

    if (words.length === 0) return null;
    let validWords = words.filter(w => isGroceryRelated(w));
    if (validWords.length === 0) return null; 
    
    words = validWords;
    let chineseWords = words.filter(w => /[\u4e00-\u9fa5]/.test(w));
    if (chineseWords.length > 0) {
        return chineseWords.slice(0, 2).join(''); 
    } else {
        words.sort((a, b) => b.length - a.length);
        return words.slice(0, 2).join(' ');
    }
}

// ==========================================
// ⏳ Loading UI 動畫 (支援多語言)
// ==========================================
// ==========================================
// ⏳ Loading UI 動畫 (支援完美多語言動態切換)
// ==========================================
function showOcrLoading(isShow, initialMsg = "處理中...") {
    let loader = document.getElementById('ocrLoaderOverlay');
    const dict = getUiDict();
    const titleMsg = dict.ocrModalTitle || "📷 AI 視覺辨識中";

    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'ocrLoaderOverlay';
        loader.className = 'fixed inset-0 bg-slate-900/60 z-[200] hidden flex flex-col items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        loader.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-[280px] w-full shadow-2xl flex flex-col items-center text-center">
                <div class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <h3 id="ocrLoaderTitle" class="text-[16px] font-black text-slate-800 dark:text-slate-100 mb-2">${titleMsg}</h3>
                <p id="ocrLoaderText" class="text-[13px] text-slate-500 dark:text-slate-400 font-bold">${initialMsg}</p>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        // 如果個視窗已經存在，每次顯示都要強制刷新一次標題語言
        const titleEl = document.getElementById('ocrLoaderTitle');
        if (titleEl) titleEl.innerText = titleMsg;
    }
    
    // 刷新下方進度文字
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
