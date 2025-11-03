// Test ekranı - Sorular burada gösterilir ve cevaplanır
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import axios from 'axios'
import api from '../config/api'

function TestEkrani() {
  const navigate = useNavigate()
  const location = useLocation()
  const soruTipi = location.state?.soruTipi || 'tumu' // Varsayılan: tümü
  
  // State yönetimi
  const [sorular, setSorular] = useState([])
  const [mevcutSoruIndex, setMevcutSoruIndex] = useState(0)
  const [kullaniciCevabi, setKullaniciCevabi] = useState('')
  const [cevapVerildi, setCevapVerildi] = useState(false)
  const [cevapSonucu, setCevapSonucu] = useState(null)
  const [dogruSayisi, setDogruSayisi] = useState(0)
  const [yanlisSayisi, setYanlisSayisi] = useState(0)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [cevaplar, setCevaplar] = useState({}) // Doğru cevapları sakla

  // Sayfa yüklendiğinde soruları getir
  useEffect(() => {
    axios.get(api.url(`/api/rastgele-sorular?tip=${soruTipi}`))
      .then(response => {
        if (response.data.sorular.length === 0) {
          alert('Henüz soru yüklenmemiş!')
          navigate('/')
          return
        }
        setSorular(response.data.sorular)
        setCevaplar(response.data.cevaplar)
        setYukleniyor(false)
      })
      .catch(error => {
        console.error('Sorular yüklenemedi:', error)
        alert('Sorular yüklenirken bir hata oluştu!')
        navigate('/')
      })
  }, [navigate])

  // Mevcut soru
  const mevcutSoru = sorular[mevcutSoruIndex]

  // Cevap kontrolü
  const cevabiKontrolEt = () => {
    if (!kullaniciCevabi.trim()) {
      alert('Lütfen bir cevap seçin veya girin!')
      return
    }

    const dogruCevap = cevaplar[mevcutSoru.id]
    const dogruMu = kullaniciCevabi.toLowerCase().trim() === dogruCevap.toString().toLowerCase().trim()

    setCevapVerildi(true)
    setCevapSonucu({
      dogru: dogruMu,
      dogruCevap: dogruCevap
    })

    if (dogruMu) {
      setDogruSayisi(dogruSayisi + 1)
    } else {
      setYanlisSayisi(yanlisSayisi + 1)
    }
  }

  // Sonraki soruya geç
  const sonrakiSoru = () => {
    // Son soru muydu?
    if (mevcutSoruIndex === sorular.length - 1) {
      // Test bitti - sonuç sayfasına git
      navigate('/sonuc', {
        state: {
          dogruSayisi,
          yanlisSayisi,
          toplamSoru: sorular.length
        }
      })
      return
    }

    // Sonraki soruya geç
    setMevcutSoruIndex(mevcutSoruIndex + 1)
    setKullaniciCevabi('')
    setCevapVerildi(false)
    setCevapSonucu(null)
  }

  // Yükleniyor durumu
  if (yukleniyor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">
          Sorular hazırlanıyor...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Üst Bar - İlerleme ve Geri Dön */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (window.confirm('Testi bırakmak istediğinize emin misiniz?')) {
                navigate('/')
              }
            }}
            className="text-white flex items-center hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Çıkış
          </button>

          <div className="text-white text-lg font-semibold">
            Soru {mevcutSoruIndex + 1} / {sorular.length}
          </div>
        </div>

        {/* Skor Kartı */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 flex justify-around text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{dogruSayisi}</div>
            <div className="text-sm">Doğru</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{yanlisSayisi}</div>
            <div className="text-sm">Yanlış</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{sorular.length - (dogruSayisi + yanlisSayisi)}</div>
            <div className="text-sm">Kalan</div>
          </div>
        </div>

        {/* Soru Kartı */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 soru-kart fade-in">
          {/* Soru Metni */}
          <div className="mb-8">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {mevcutSoru.tip === 'coktan-secmeli' ? '📝 Çoktan Seçmeli' : '✏️ Boşluk Doldurma'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {mevcutSoru.soruMetni}
            </h2>
          </div>

          {/* Şıklar veya Cevap Girişi */}
          {mevcutSoru.tip === 'coktan-secmeli' ? (
            <div className="space-y-3 mb-6">
              {mevcutSoru.siklar.map((sik) => (
                <button
                  key={sik.harf}
                  onClick={() => !cevapVerildi && setKullaniciCevabi(sik.harf)}
                  disabled={cevapVerildi}
                  className={`
                    w-full p-4 rounded-xl text-left font-medium transition-all
                    ${cevapVerildi
                      ? sik.harf === cevapSonucu.dogruCevap
                        ? 'bg-green-100 border-2 border-green-500 text-green-800'
                        : sik.harf === kullaniciCevabi
                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-gray-100 text-gray-500'
                      : kullaniciCevabi === sik.harf
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700'
                    }
                    ${!cevapVerildi && 'cursor-pointer'}
                  `}
                >
                  <span className="font-bold mr-3">{sik.harf})</span>
                  {sik.metin}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <input
                type="text"
                value={kullaniciCevabi}
                onChange={(e) => setKullaniciCevabi(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !cevapVerildi && cevabiKontrolEt()}
                disabled={cevapVerildi}
                placeholder="Cevabınızı buraya yazın..."
                className={`
                  w-full p-4 rounded-xl border-2 text-lg
                  ${cevapVerildi
                    ? cevapSonucu.dogru
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : 'bg-red-50 border-red-500 text-red-800'
                    : 'border-gray-300 focus:border-blue-500 focus:outline-none'
                  }
                `}
              />
            </div>
          )}

          {/* Cevap Sonucu Mesajı */}
          {cevapVerildi && (
            <div className={`
              mb-6 p-4 rounded-xl flex items-start fade-in
              ${cevapSonucu.dogru
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-red-50 border-2 border-red-300'
              }
            `}>
              {cevapSonucu.dogru ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800 text-lg">
                      ✅ Doğru Cevap!
                    </h3>
                    <p className="text-green-700">
                      Tebrikler, doğru bildiniz! 🎉
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 text-lg">
                      ❌ Yanlış Cevap!
                    </h3>
                    <p className="text-red-700">
                      Doğru cevap: <span className="font-bold">{cevapSonucu.dogruCevap}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-4">
            {!cevapVerildi ? (
              <button
                onClick={cevabiKontrolEt}
                className="
                  flex-1 bg-gradient-to-r from-blue-500 to-blue-600 
                  text-white py-4 rounded-xl font-semibold text-lg
                  btn-hover
                "
              >
                Cevabı Kontrol Et
              </button>
            ) : (
              <button
                onClick={sonrakiSoru}
                className="
                  flex-1 bg-gradient-to-r from-green-500 to-green-600 
                  text-white py-4 rounded-xl font-semibold text-lg
                  btn-hover flex items-center justify-center
                "
              >
                {mevcutSoruIndex === sorular.length - 1 ? (
                  'Testi Bitir'
                ) : (
                  <>
                    Sonraki Soru
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
            style={{ width: `${((mevcutSoruIndex + 1) / sorular.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default TestEkrani
