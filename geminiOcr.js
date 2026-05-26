// geminiOcr.js - 專屬 Gemini 視覺引擎 (自動尋找最新模型版)

async function callGeminiVision(file, apiKey) {
    try {
        // ==========================================
        // 1. 自動尋找可用嘅最新 Model (解決 404 退役問題)
        // ==========================================
        let modelName = "gemini-2.5-flash"; // 基礎兜底模型 (新版)
        
        try {
            const modelRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const modelData = await modelRes.json();
            
            if (modelData.models) {
                const available = modelData.models.map(m => m.name.replace('models/', ''));
                console.log("🔍 系統查出你可用嘅模型清單:\n", available.join(', '));
                
                // 動態過濾出所有包含 'flash' 嘅穩定版模型
                const flashModels = available.filter(m => m.includes('flash') && !m.includes('exp'));
                
                if (flashModels.length > 0) {
                    // 利用 sort 確保攞到最新版本 (例如 gemini-3.5-flash 會排喺 2.5 後面)
                    flashModels.sort();
                    modelName = flashModels[flashModels.length - 1]; 
                } else if (available.length > 0) {
                    // 如果真係冇 flash，搵其他有 'gemini' 嘅頂上
                    modelName = available.find(m => m.includes('gemini')) || available[0];
                }
            }
        } catch (e) {
            console.warn("無法獲取模型清單，強制使用兜底模型", e);
        }

        console.log(`🚀 最終決定使用模型: ${modelName}`);

        // ==========================================
        // 2. 處理圖片與發送請求
        // ==========================================
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
                        {
                            inlineData: {
                                mimeType: file.type,
                                data: base64Image.split(',')[1] // 只要 base64 數據部分
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(`${data.error.code} - ${data.error.message}`);
        }

        // 3. 提取最終關鍵字
        const finalKeyword = data.candidates[0].content.parts[0].text.trim();
        console.log("✨ Gemini 終極解答:", finalKeyword);

        return finalKeyword;

    } catch (error) {
        console.error("Gemini 辨識失敗:", error);
        throw error; 
    }
}

// 輔助 Function：將檔案轉做 Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
