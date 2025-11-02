// Ana uygulama bileşeni - Routing ve sayfa yönetimi
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AnaSayfa from './pages/AnaSayfa'
import TestEkrani from './pages/TestEkrani'
import SonucEkrani from './pages/SonucEkrani'

// GitHub Pages için base path (repo adı)
const basename = import.meta.env.BASE_URL || '/'

function App() {
  return (
    <Router basename={basename}>
      <div className="min-h-screen">
        <Routes>
          {/* Ana sayfa - Teste başla */}
          <Route path="/" element={<AnaSayfa />} />
          
          {/* Test ekranı - Sorular burada gösterilir */}
          <Route path="/test" element={<TestEkrani />} />
          
          {/* Sonuç ekranı - Test bitiminde skorlar */}
          <Route path="/sonuc" element={<SonucEkrani />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
