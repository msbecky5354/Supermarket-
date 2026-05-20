// api/smartScore.js (Vercel 後台專用，絕對保密)
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { price, promoInfo } = req.body;
        
        // 🔒 呢度就係你嘅「商業機密演算法」，前端永遠睇唔到
        let secretScore = 0;
        if (price < 50 && promoInfo.includes('買一送一')) {
            secretScore = 99; // 爆分！
        } else {
            secretScore = 50; // 一般般
        }
        
        // 計完之後，只係將「結果」送返出去
        res.status(200).json({ score: secretScore, message: "機密計算完成" });
    } else {
        res.status(405).send('Method Not Allowed');
    }
}