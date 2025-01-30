import { useState } from 'react'
import { dictionary } from './constants/dictionary'


function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedWord, setSelectedWord] = useState('')
  const [translation, setTranslation] = useState('')
  const handleWordClick = (text, isInput) => {
    const word = text.trim().toLowerCase()
    setSelectedWord(word)
    
    if (isInput) {
      const translation = dictionary[word] || 'Không tìm thấy bản dịch'
      setTranslation(translation)
    } else {
      const ngheAnWord = Object.entries(dictionary)
        .find(([_, viet]) => viet.toLowerCase() === word)?.[0] || 'Không tìm thấy từ gốc'
      setTranslation(ngheAnWord)
    }
  }
  const translateText = (text) => {
    try {
      let result = text;
      console.log('Input text:', text);
      
      let lowerResult = result.toLowerCase();
      
      const entries = Object.entries(dictionary)
        .sort((a, b) => {
          if (b[0].length !== a[0].length) {
            return b[0].length - a[0].length;
          }
          return b[0].localeCompare(a[0]);
        });
  
      for (const [ngheAn, vietNam] of entries) {
        const escapedTerm = ngheAn.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\S)${escapedTerm}(?!\\S)`, 'g');
        
        if (lowerResult === ngheAn.toLowerCase()) {
          console.log(`Exact match: ${ngheAn} -> ${vietNam}`);
          return vietNam;
        }
        
        if (regex.test(lowerResult)) {
          console.log(`Matching: ${ngheAn} -> ${vietNam}`);
          lowerResult = lowerResult.replace(regex, vietNam);
        }
      }
      
      return lowerResult;
      
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
  Object.entries(dictionary).forEach(([key, value]) => {
    if (!key || !value) {
      console.warn(`Invalid dictionary entry: ${key} -> ${value}`);
    }
  });

  const handleInputChange = (e) => {
    const text = e.target.value
    setInputText(text)
    setOutputText(translateText(text))
  }


  const handleTextareaClick = (e, isInput) => {
    const selection = window.getSelection().toString()
    if (selection) {
      handleWordClick(selection, isInput)
    }
  }
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
     
      <nav className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Từ điển Nghệ An</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        <header className="text-center space-y-4">
          <h2 className={`text-4xl md:text-5xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Từ điển Tiếng Nghệ An - Tiếng Phổ Thông
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Chuyển đổi ngôn ngữ một cách dễ dàng và chính xác
          </p>
        </header>

       
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <span className="text-indigo-600 mr-2">📝</span>
              Tiếng Nghệ An
            </h3>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              onMouseUp={(e) => handleTextareaClick(e, true)}
              placeholder="Nhập văn bản tiếng Nghệ An..."
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow"
            />
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <span className="text-indigo-600 mr-2">🔄</span>
              Tiếng Phổ Thông
            </h3>
            <textarea
              value={outputText}
              readOnly
              onMouseUp={(e) => handleTextareaClick(e, false)}
              placeholder="Bản dịch..."
              className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none"
            />
          </div>
        </div>

        {selectedWord && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <span className="text-indigo-600 mr-2">🔍</span>
              Từ đã chọn
            </h3>
            <div className="flex items-center gap-4">
              <span className="font-medium text-indigo-700">{selectedWord}</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700">{translation}</span>
            </div>
          </div>
        )}
        <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-indigo-600 mr-2">📚</span>
            Từ điển tham khảo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(dictionary).map(([ngheAn, phoThong]) => (
              <div
                key={ngheAn}
                className="flex items-center bg-gray-50 rounded-lg p-3 hover:bg-indigo-50 transition-colors group"
              >
                <span className="font-medium text-indigo-700">{ngheAn}</span>
                <span className="mx-2 text-gray-400 group-hover:text-indigo-400">→</span>
                <span className="text-gray-700">{phoThong}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

    
      <footer className={`mt-8 py-6 text-center ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <p>© 2025 Từ điển Nghệ An. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;