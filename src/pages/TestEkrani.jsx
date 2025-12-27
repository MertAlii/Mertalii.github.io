// Test ekranı - Sorular burada gösterilir ve cevaplanır
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, ChevronLeft, Eye, AlertTriangle, LogOut, CheckSquare, Clock } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../config'

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

  // Timer
  const [gecenSure, setGecenSure] = useState(0)

  // Tüm verilen cevapları sakla: { index: { cevap: 'A', dogruMu: true/false, bos: boolean } }
  const [tumCevaplar, setTumCevaplar] = useState({})

  // Custom Alert State
  const [uyari, setUyari] = useState(null)
  const [cikisModalAcik, setCikisModalAcik] = useState(false)
  const [bitirModalAcik, setBitirModalAcik] = useState(false)

  const [yukleniyor, setYukleniyor] = useState(true)
  const [cevaplar, setCevaplar] = useState({}) // Doğru cevapları sakla

  const uyariGoster = (mesaj, tur = 'hata') => {
    setUyari({ mesaj, tur })
    setTimeout(() => setUyari(null), 3000)
  }

  // Timer Effect
  useEffect(() => {
    if (yukleniyor) return
    const interval = setInterval(() => {
      setGecenSure(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [yukleniyor])

  const sureFormatla = (saniye) => {
    const dk = Math.floor(saniye / 60)
    const sn = saniye % 60
    return `${dk}:${sn < 10 ? '0' : ''}${sn}`
  }

  // Sayfa yüklendiğinde soruları getir
  useEffect(() => {
    axios.get(`${API_URL}/rastgele-sorular?tip=${soruTipi}`)
      .then(response => {
        if (response.data.sorular.length === 0) {
          navigate('/')
          return
        }
        setSorular(response.data.sorular)
        setCevaplar(response.data.cevaplar)
        setYukleniyor(false)
      })
      .catch(error => {
        console.error('Sorular yüklenemedi:', error)
        navigate('/')
      })
  }, [navigate, soruTipi])

  // Soru değiştiğinde durumu geri yükle
  useEffect(() => {
    const kayitliCevap = tumCevaplar[mevcutSoruIndex]

    if (kayitliCevap && !kayitliCevap.bos) {
      setKullaniciCevabi(kayitliCevap.cevap)
      setCevapVerildi(true)

      const mevcutSoru = sorular[mevcutSoruIndex]
      const dogruCevap = cevaplar[mevcutSoru.id]

      if (soruTipi === 'klasik') {
        setCevapSonucu({
          dogru: true,
          dogruCevap: dogruCevap,
          mesaj: dogruCevap
        })
      } else {
        setCevapSonucu({
          dogru: kayitliCevap.dogruMu,
          dogruCevap: dogruCevap
        })
      }
    } else {
      setKullaniciCevabi(kayitliCevap ? kayitliCevap.cevap : '')
      setCevapVerildi(false)
      setCevapSonucu(null)
    }
  }, [mevcutSoruIndex, sorular, tumCevaplar, cevaplar, soruTipi])

  const mevcutSoru = sorular[mevcutSoruIndex]

  // Cevabı Göster (Klasik Mod)
  const cevabiGoster = () => {
    const dogruCevap = cevaplar[mevcutSoru.id]
    setCevapVerildi(true)

    const yeniSonuc = { dogru: true, dogruCevap: dogruCevap, mesaj: dogruCevap }
    setCevapSonucu(yeniSonuc)

    setTumCevaplar(prev => ({
      ...prev,
      [mevcutSoruIndex]: { cevap: 'Görüntülendi', dogruMu: true, bos: false }
    }))
  }

  // Cevap kontrolü
  const cevabiKontrolEt = (secilenCevap = null) => {
    const cevap = secilenCevap || kullaniciCevabi

    if (!cevap || !cevap.trim()) {
      uyariGoster('Lütfen bir cevap seçin veya girin!')
      return
    }

    setKullaniciCevabi(cevap)

    const dogruCevap = cevaplar[mevcutSoru.id]
    const dogruMu = callbackDogruMu(cevap, dogruCevap)

    setCevapVerildi(true)
    setCevapSonucu({ dogru: dogruMu, dogruCevap: dogruCevap })

    setTumCevaplar(prev => ({
      ...prev,
      [mevcutSoruIndex]: { cevap: cevap, dogruMu: dogruMu, bos: false }
    }))
  }

  const callbackDogruMu = (kullanici, dogru) => {
    return kullanici.toString().toLowerCase().trim() === dogru.toString().toLowerCase().trim()
  }

  const oncekiSoru = () => {
    if (mevcutSoruIndex > 0) {
      setMevcutSoruIndex(mevcutSoruIndex - 1)
      setUyari(null)
    }
  }

  const sonrakiSoru = () => {
    // Cevap verilmediyse boş olarak kaydet
    if (!cevapVerildi) {
      setTumCevaplar(prev => ({
        ...prev,
        [mevcutSoruIndex]: { cevap: '', dogruMu: false, bos: true }
      }))
    }

    if (mevcutSoruIndex === sorular.length - 1) {
      setBitirModalAcik(true)
      return
    }

    setMevcutSoruIndex(mevcutSoruIndex + 1)
    setUyari(null)
  }

  // Testi Bitir ve Sonuçları Hesapla
  const testiBitir = () => {
    const guncelCevaplar = { ...tumCevaplar }
    // Son soruyu boş geçtiyse ekle
    if (!cevapVerildi && !guncelCevaplar[mevcutSoruIndex]) {
      guncelCevaplar[mevcutSoruIndex] = { cevap: '', dogruMu: false, bos: true }
    }

    let d = 0, y = 0, b = 0
    const detayliSonuclar = []

    sorular.forEach((soru, index) => {
      const cevapBilgisi = guncelCevaplar[index]
      const dogruCevap = cevaplar[soru.id]

      let durum = 'bos'
      if (cevapBilgisi) {
        if (cevapBilgisi.bos) {
          b++
          durum = 'bos'
        } else if (cevapBilgisi.dogruMu) {
          d++
          durum = 'dogru'
        } else {
          y++
          durum = 'yanlis'
        }
      } else {
        b++
      }

      if (durum !== 'dogru') {
        detayliSonuclar.push({
          ...soru,
          durum,
          verilenCevap: cevapBilgisi ? cevapBilgisi.cevap : '',
          dogruCevap
        })
      }
    })

    navigate('/sonuc', {
      state: {
        id: Date.now(), // Unique ID for history
        dogruSayisi: d,
        yanlisSayisi: y,
        bosSayisi: b,
        toplamSoru: sorular.length,
        detayliSonuclar,
        soruTipi,
        sure: sureFormatla(gecenSure)
      }
    })
  }

  if (yukleniyor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-xl animate-pulse">Sorular Hazırlanıyor...</div>
        </div>
      </div>
    )
  }

  const isKlasik = soruTipi === 'klasik'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-dark">
      {/* Arkaplan */}
      {/* Arkaplan ve Efektler - Ana Sayfa ile Birebir Aynı */}
      {/* Arkaplan ve Efektler - Ana Sayfa ile Birebir Aynı */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* CUSTOM ALERT */}
      {uyari && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md
                ${uyari.tur === 'hata' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-blue-500/90 border-blue-400 text-white'}
            `}>
            {uyari.tur === 'hata' ? <AlertTriangle className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            <span className="font-bold text-lg">{uyari.mesaj}</span>
          </div>
        </div>
      )}

      {/* ÇIKIŞ MODAL */}
      {cikisModalAcik && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Çıkış Yapılıyor</h3>
            <p className="text-gray-300 mb-8">Testi bitirmeden çıkmak istediğinize emin misiniz?</p>
            <div className="flex gap-4 w-full">
              <button onClick={() => setCikisModalAcik(false)} className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors">Vazgeç</button>
              <button onClick={() => navigate('/')} className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Evet, Çık</button>
            </div>
          </div>
        </div>
      )}

      {/* BITIR MODAL */}
      {bitirModalAcik && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center">
            <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Testi Bitir</h3>
            <p className="text-gray-300 mb-8">Testi sonlandırıp sonuçları görmek istiyor musunuz?</p>
            <div className="flex gap-4 w-full">
              <button onClick={() => setBitirModalAcik(false)} className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors">Vazgeç</button>
              <button onClick={testiBitir} className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">Evet, Bitir</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl w-full relative z-10">
        {/* Üst Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCikisModalAcik(true)}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </button>

          {/* Timer Display */}
          <div className="glass-panel px-6 py-2 rounded-full flex items-center gap-3 bg-black/40">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-xl font-mono font-bold text-white">{sureFormatla(gecenSure)}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-300 font-medium">
              <span className="text-purple-400 font-bold text-xl">{mevcutSoruIndex + 1}</span>
              <span className="text-gray-500 mx-2">/</span>
              <span>{sorular.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${((mevcutSoruIndex + 1) / sorular.length) * 100}%` }}
          >
            <div className="w-full h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>

        {/* Soru Kartı */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-300">

          {/* Soru Metni */}
          <div className="mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6
                ${isKlasik ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}
            `}>
              {mevcutSoru.tip === 'coktan-secmeli' ? '📝 Çoktan Seçmeli' :
                mevcutSoru.tip === 'klasik' ? '💡 Klasik Soru' : '✏️ Boşluk Doldurma'}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {mevcutSoru.soruMetni}
            </h2>
          </div>

          {/* Şıklar / Cevap Girişi */}
          {mevcutSoru.tip === 'coktan-secmeli' ? (
            <div className="space-y-4 mb-8">
              {mevcutSoru.siklar.map((sik) => {
                // Şık durumunu belirle
                let stil = 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                if (cevapVerildi) {
                  if (sik.harf === cevapSonucu.dogruCevap) {
                    stil = 'bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  } else if (sik.harf === kullaniciCevabi) {
                    stil = 'bg-red-500/20 border-red-500/50 text-red-300'
                  } else {
                    stil = 'bg-white/5 border-white/5 opacity-50'
                  }
                } else if (kullaniciCevabi === sik.harf) {
                  stil = 'bg-purple-600/30 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                }

                return (
                  <button
                    key={sik.harf}
                    onClick={() => !cevapVerildi && cevabiKontrolEt(sik.harf)}
                    disabled={cevapVerildi}
                    className={`
                        w-full p-5 rounded-2xl text-left font-medium transition-all duration-200 border-2
                        flex items-center gap-4 ${stil}
                        ${!cevapVerildi && 'cursor-pointer hover:scale-[1.01]'}
                    `}
                  >
                    <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
                        ${cevapVerildi && sik.harf === cevapSonucu.dogruCevap ? 'bg-green-500 text-white' :
                        cevapVerildi && sik.harf === kullaniciCevabi ? 'bg-red-500 text-white' :
                          'bg-white/10 text-gray-300'}
                    `}>
                      {sik.harf}
                    </div>
                    <span>{sik.metin}</span>
                  </button>
                )
              })}
            </div>
          ) : isKlasik ? (
            <div className="mb-8 bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20">
              <p className="text-orange-200 italic mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Bu soruyu kendiniz cevaplayın, emin olmadığınızda cevabı görebilirsiniz.
              </p>
              {cevapVerildi && (
                <div className="mt-4 p-6 bg-black/40 rounded-xl border border-orange-500/40 fade-in">
                  <h4 className="font-bold text-orange-400 mb-2 text-sm uppercase tracking-wide">Doğru Cevap</h4>
                  <p className="text-white text-lg">{cevapSonucu.mesaj}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <input
                type="text"
                value={kullaniciCevabi}
                onChange={(e) => setKullaniciCevabi(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !cevapVerildi && cevabiKontrolEt()}
                disabled={cevapVerildi}
                placeholder="Cevabınızı buraya yazın..."
                className={`
                  w-full p-6 rounded-2xl text-xl transition-all outline-none border-2
                  ${cevapVerildi
                    ? cevapSonucu.dogru
                      ? 'bg-green-500/10 border-green-500/50 text-green-300'
                      : 'bg-red-500/10 border-red-500/50 text-red-300'
                    : 'bg-black/20 border-white/10 text-white focus:border-purple-500 focus:bg-black/40 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  }
                `}
              />
            </div>
          )}

          {/* Cevap Sonucu (Normal Mod) */}
          {cevapVerildi && !isKlasik && (
            <div className={`
              mb-8 p-4 rounded-2xl flex items-center gap-4 fade-in
              ${cevapSonucu.dogru
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
              }
            `}>
              {cevapSonucu.dogru ? (
                <>
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-400 text-lg">Harika! Doğru Cevap</h3>
                    <p className="text-green-300/80 text-sm">Tebrikler, doğru bildiniz! 🎉</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-500 text-white p-2 rounded-full">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-400 text-lg">Maalesef Yanlış</h3>
                    <p className="text-red-300/80 text-sm">Doğru cevap: <span className="font-bold text-white">{cevapSonucu.dogruCevap}</span></p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigasyon Butonları */}
          {/* DURUM ÇUBUĞU (Artık Navigation Kısmında) */}
          {/* Navigasyon ve Durum Çubuğu */}
          <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-white/10">

            {/* Durum Çubuğu - Butonların Üstünde Bir Blok */}
            <div className="glass-panel p-3 rounded-xl flex items-center justify-between border border-white/5 bg-black/40">
              <div className="flex flex-col items-center px-4 w-1/3 border-r border-white/10">
                <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-1">Doğru</div>
                <div className="text-xl font-black text-white leading-none">
                  {Object.values(tumCevaplar).filter(c => c.dogruMu).length}
                </div>
              </div>
              <div className="flex flex-col items-center px-4 w-1/3">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Kalan</div>
                <div className="text-xl font-black text-white leading-none">
                  {sorular.length - Object.keys(tumCevaplar).filter(k => !tumCevaplar[k].bos).length}
                </div>
              </div>
              <div className="flex flex-col items-center px-4 w-1/3 border-l border-white/10">
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Yanlış</div>
                <div className="text-xl font-black text-white leading-none">
                  {Object.values(tumCevaplar).filter(c => !c.dogruMu && !c.bos).length}
                </div>
              </div>
            </div>

            {/* Butonlar - Alt Satır */}
            <div className="flex gap-4 h-14">
              {/* Önceki Butonu - Her zaman var ama disabled olabilir */}
              <button
                onClick={oncekiSoru}
                disabled={mevcutSoruIndex === 0}
                className={`
                    px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                    ${mevcutSoruIndex === 0
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'}
                  `}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Önceki</span>
              </button>

              {/* Orta Boşluk veya Cevabı Göster */}
              {!cevapVerildi ? (
                isKlasik ? (
                  <button
                    onClick={cevabiGoster}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Cevabı Göster
                  </button>
                ) : (
                  <div className="flex-1"></div>
                )
              ) : (
                <div className="flex-1"></div>
              )}

              {/* Sonraki Butonu */}
              <button
                onClick={sonrakiSoru}
                className={`
                    px-8 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 min-w-[140px] transition-all hover:scale-[1.02]
                    ${mevcutSoruIndex === sorular.length - 1
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'}
                  `}
              >
                {mevcutSoruIndex === sorular.length - 1 ? (
                  <>Bitir <CheckSquare className="w-5 h-5" /></>
                ) : (
                  <>
                    <span className="mr-1">Sonraki</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TestEkrani
