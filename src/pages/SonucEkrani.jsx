// Sonuç ekranı - Test bitiminde skor ve istatistikler gösterilir
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, Home, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

function SonucEkrani() {
  const location = useLocation()
  const navigate = useNavigate()
  const [animasyon, setAnimasyon] = useState(false)

  // Sonuç verileri
  const { dogruSayisi = 0, yanlisSayisi = 0, toplamSoru = 0 } = location.state || {}

  // Eğer veri yoksa ana sayfaya yönlendir
  useEffect(() => {
    if (!location.state) {
      navigate('/')
      return
    }
    
    // Animasyon için gecikme
    setTimeout(() => setAnimasyon(true), 300)
  }, [location.state, navigate])

  // Başarı yüzdesi hesapla
  const basariYuzdesi = toplamSoru > 0 ? Math.round((dogruSayisi / toplamSoru) * 100) : 0

  // Başarı durumuna göre mesaj ve renk
  const basariDurumu = () => {
    if (basariYuzdesi >= 90) {
      return {
        mesaj: 'Mükemmel! 🎉',
        renk: 'text-yellow-500',
        aciklama: 'Harika bir performans sergiledınız!'
      }
    } else if (basariYuzdesi >= 70) {
      return {
        mesaj: 'Çok İyi! 👏',
        renk: 'text-green-500',
        aciklama: 'Başarılı bir test oldunuz!'
      }
    } else if (basariYuzdesi >= 50) {
      return {
        mesaj: 'İyi! 👍',
        renk: 'text-blue-500',
        aciklama: 'Fena değil, biraz daha çalışmalısınız.'
      }
    } else {
      return {
        mesaj: 'Daha İyi Olabilir 📚',
        renk: 'text-orange-500',
        aciklama: 'Pes etmeyin, pratik yapın!'
      }
    }
  }

  const durum = basariDurumu()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Ana Kart */}
        <div className={`
          bg-white rounded-3xl shadow-2xl p-8 
          transform transition-all duration-500
          ${animasyon ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}>
          {/* Kupa İkonu */}
          <div className="flex justify-center mb-6">
            <div className={`
              ${durum.renk} p-6 bg-gray-50 rounded-full
              transform transition-all duration-500 delay-200
              ${animasyon ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
            `}>
              <Trophy className="w-20 h-20" />
            </div>
          </div>

          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${durum.renk}`}>
              {durum.mesaj}
            </h1>
            <p className="text-gray-600 text-lg">
              {durum.aciklama}
            </p>
          </div>

          {/* Başarı Yüzdesi - Dairesel */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              {/* Arka plan daire */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                {/* İlerleme dairesi */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={basariYuzdesi >= 70 ? '#10b981' : basariYuzdesi >= 50 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - basariYuzdesi / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Yüzde metni */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${durum.renk}`}>
                    {basariYuzdesi}%
                  </div>
                  <div className="text-gray-500 text-sm">Başarı</div>
                </div>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Doğru Sayısı */}
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">{dogruSayisi}</div>
              <div className="text-sm text-green-700">Doğru</div>
            </div>

            {/* Yanlış Sayısı */}
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-600">{yanlisSayisi}</div>
              <div className="text-sm text-red-700">Yanlış</div>
            </div>

            {/* Toplam Soru */}
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-3xl font-bold text-blue-600">{toplamSoru}</div>
              <div className="text-sm text-blue-700">Toplam</div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tekrar Test Ol */}
            <button
              onClick={() => navigate('/test')}
              className="
                bg-gradient-to-r from-blue-500 to-blue-600 
                text-white py-4 rounded-xl font-semibold
                btn-hover flex items-center justify-center
              "
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Tekrar Test Ol
            </button>

            {/* Ana Sayfaya Dön */}
            <button
              onClick={() => navigate('/')}
              className="
                bg-gradient-to-r from-gray-500 to-gray-600 
                text-white py-4 rounded-xl font-semibold
                btn-hover flex items-center justify-center
              "
            >
              <Home className="w-5 h-5 mr-2" />
              Ana Sayfa
            </button>
          </div>

          {/* Motivasyon Mesajı */}
          <div className="mt-6 text-center text-gray-600 text-sm">
            {basariYuzdesi >= 70 ? (
              <p>💪 Harika gidiyorsunuz! Böyle devam edin!</p>
            ) : (
              <p>📚 Pratik yapmaya devam edin, başarı yakında!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SonucEkrani
