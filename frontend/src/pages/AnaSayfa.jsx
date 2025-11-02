// Ana sayfa - Kullanıcı buradan teste başlar veya soru yükler
import { useNavigate } from 'react-router-dom'
import { BookOpen, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../config/api'

function AnaSayfa() {
  const navigate = useNavigate()
  const [soruSayisi, setSoruSayisi] = useState(0)
  const [yukleniyor, setYukleniyor] = useState(true)

  // Sayfa yüklendiğinde mevcut soru sayısını getir
  useEffect(() => {
    axios.get(api.url('/api/sorular'))
      .then(response => {
        setSoruSayisi(response.data.toplam)
        setYukleniyor(false)
      })
      .catch(error => {
        console.error('Soru sayısı alınamadı:', error)
        setYukleniyor(false)
      })
  }, [])

  const testeBasla = (soruTipi) => {
    if (soruSayisi === 0) {
      alert('Henüz soru yüklenmemiş!')
      return
    }
    navigate('/test', { state: { soruTipi } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Başlık */}
        <div className="text-center mb-12 fade-in">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Test Uygulaması
          </h1>
          <p className="text-xl text-white/90">
            Bilgini test et, kendini geliştir! 🚀
          </p>
        </div>

        {/* İstatistik Kartı */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 text-center fade-in">
          <div className="text-white/80 text-lg mb-2">Sistemdeki Toplam Soru</div>
          {yukleniyor ? (
            <div className="text-4xl font-bold text-white">Yükleniyor...</div>
          ) : (
            <div className="text-5xl font-bold text-white">{soruSayisi}</div>
          )}
        </div>

        {/* Test Seçenekleri - 2 Buton */}
        <div className="grid md:grid-cols-2 gap-6 fade-in">
          {/* Çoktan Seçmeli Test */}
          <button
            onClick={() => testeBasla('coktan-secmeli')}
            disabled={soruSayisi === 0}
            className={`
              bg-gradient-to-r from-blue-400 to-blue-600 
              text-white rounded-3xl p-10 
              flex flex-col items-center justify-center
              transition-all duration-300 shadow-2xl
              ${soruSayisi === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'btn-hover hover:from-blue-500 hover:to-blue-700 cursor-pointer'}
            `}
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-3xl font-bold mb-3">Çoktan Seçmeli</h2>
            <p className="text-white/90 text-lg">
              A, B, C, D şıklarıyla test ol
            </p>
            <div className="mt-4 text-sm bg-white/20 px-4 py-2 rounded-full">
              275 soru
            </div>
          </button>

          {/* Boşluk Doldurma Test */}
          <button
            onClick={() => testeBasla('bosluk-doldurma')}
            disabled={soruSayisi === 0}
            className={`
              bg-gradient-to-r from-purple-400 to-purple-600 
              text-white rounded-3xl p-10 
              flex flex-col items-center justify-center
              transition-all duration-300 shadow-2xl
              ${soruSayisi === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'btn-hover hover:from-purple-500 hover:to-purple-700 cursor-pointer'}
            `}
          >
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-3xl font-bold mb-3">Boşluk Doldurma</h2>
            <p className="text-white/90 text-lg">
              Kısa cevaplarla bilgini test et
            </p>
            <div className="mt-4 text-sm bg-white/20 px-4 py-2 rounded-full">
              300 soru
            </div>
          </button>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center mt-12 text-white/70 fade-in">
          <p className="text-lg font-semibold mb-2">
            🎯 İstediğin Test Tipini Seç!
          </p>
          <p className="text-sm">
            Toplam 575 Arduino ve ESP32 sorusu hazır
          </p>
        </div>
      </div>
    </div>
  )
}

export default AnaSayfa
