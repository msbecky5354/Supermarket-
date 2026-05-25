// 1. 引入剛才建立的 Header 組件
// 注意：如果你的首頁和 components 資料夾在同一層，路徑就是 './components/Header'
// 如果首頁在 app 資料夾裡面，路徑可能是 '../components/Header'
import Header from '../components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-10 font-sans">
      
      {/* 2. 在頁面最上方顯示 Header */}
      <Header />
      
      {/* 3. 網站主體內容 (搜尋區塊) */}
      <div className="flex flex-col items-center mt-12 px-4">
        
        {/* 機器人圖示 */}
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm border border-blue-100">
          🤖
        </div>
        
        {/* 標題 */}
        <h1 className="text-xl font-bold text-gray-800 mb-6 tracking-wide">
          想搵咩平嘢？直接話我知
        </h1>
        
        {/* 搜尋框區塊 */}
        <div className="w-full max-w-[500px] relative">
          <input 
            type="text" 
            placeholder="例如：可口可樂、出前一丁..." 
            className="w-full py-3.5 pl-5 pr-14 rounded-full border border-gray-200 shadow-sm text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {/* 送出按鈕 (紙飛機 icon 示意) */}
          <button className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-blue-600 text-white rounded-full flex justify-center items-center hover:bg-blue-700 transition-colors shadow-md">
            <svg className="w-4 h-4 ml-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>

      </div>
    </main>
  );
}