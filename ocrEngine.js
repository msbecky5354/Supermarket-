// ocrEngine.js - 整合版 OCR 引擎

// 💡 1. 加一個 Flag 防止重複觸發
let isProcessing = false; 

async function handleOcrUpload(event) {
    if (isProcessing) return;
    
    const file = event.target.files[0];
    if (!file) return;

    isProcessing = true;
    const apiKey = localStorage.getItem('gemini_api_key');
    const inputEl = document.getElementById('globalSearchInput');
    const fileInput = event.target;

    // 💡 邏輯改為：有 Key 就嘗試用 Gemini，失敗或冇 Key 就行 Tesseract
    const useGemini = (apiKey && apiKey.length > 10);

    if (useGemini) {
        const originalPlaceholder = inputEl.placeholder;
        inputEl.placeholder = "AI 辨識中 (Gemini)...";
        
        try {
            const keyword = await ocrEngine(file, apiKey);
            inputEl.value = keyword;
            inputEl.focus();
            closeCameraMenu(); // 成功後關閉選單
        } catch (err) {
            console.error("Gemini 辨識失敗，自動降級至 Tesseract:", err);
            // 💡 降級機制：Gemini 失敗，自動行 Tesseract
            await runTesseractFallback(file, inputEl);
        } finally {
            inputEl.placeholder = originalPlaceholder;
            fileInput.value = null;
            isProcessing = false;
        }
    } else {
        // 💡 直接行 Tesseract (無需 Key)
        console.log("偵測到無 API Key，直接使用離線 Tesseract 辨識");
        await runTesseractFallback(file, inputEl);
        fileInput.value = null;
        isProcessing = false;
    }
}

// 💡 封裝一個簡單嘅 Fallback 函數，確保流程統一
async function runTesseractFallback(file, inputEl) {
    inputEl.placeholder = "辨識中 (離線)...";
    // 假設你原本已經有 Tesseract 嘅相關邏輯，將佢包落嚟
    // 如果你原本是用 Tesseract.recognize，請確保你已經引入咗 Tesseract library
    try {
        const result = await Tesseract.recognize(file, 'chi_tra+eng'); // 繁體+英文
        inputEl.value = result.data.text.trim().split('\n')[0]; // 取第一行
        inputEl.focus();
    } catch (e) {
        alert("離線辨識出現錯誤，請手動輸入。");
    } finally {
        inputEl.placeholder = "例如: 可口可樂、出前一丁...";
        closeCameraMenu();
    }
}

// 2. 你的 ocrEngine 函數 (保持不變)
async function ocrEngine(file, apiKey) {
    try {
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
                }
            }
        } catch (e) {
            console.warn("無法獲取模型清單，使用預設:", e);
        }

        const base64Image = await fileToBase64(file);
        const promptText = `
            你是一個香港超市格價專家。
            請查看這張包裝圖片，並直接提取產品的「品牌名稱」與「核心產品名」。
            例如：維他檸檬茶、善存男士50+、萬寧迷你紙巾。
            請直接輸出最終的中文搜尋關鍵字，不要輸出任何解釋、成分表或多餘符號。
        `;

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
        if (data.error) throw new Error(data.error.message);

        const rawResult = data.candidates[0].content.parts[0].text.trim();
        
        // 💡 清理文字 (Sanitization)
        const cleanOutput = rawResult
            .replace(/^.*是：/, '') 
            .replace(/^.*名稱：/, '')
            .replace(/["'。，]/g, '')
            .trim();

        console.log("✨ Gemini 終極解答:", cleanOutput);
        return cleanOutput;

    } catch (error) {
        console.error("Gemini 辨識失敗:", error);
        throw error; 
    }
}

// 輔助 Function
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
