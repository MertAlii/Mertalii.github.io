// Sonuç ekranı - Test bitiminde skor ve istatistikler gösterilir
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, Home, RotateCcw, CheckCircle, XCircle, AlertCircle, Eye, AlertTriangle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

import axios from 'axios'
import { API_URL } from '../config'

function SonucEkrani() {
  const location = useLocation()
  const navigate = useNavigate()
  const [animasyon, setAnimasyon] = useState(false)

  // Sonuç verileri
  const {
    id,
    dogruSayisi = 0,
    yanlisSayisi = 0,
    bosSayisi = 0,
    toplamSoru = 0,
    detayliSonuclar = [],
    soruTipi,
    sure = '0:00'
  } = location.state || {}

  const basariYuzdesi = toplamSoru > 0 ? Math.round((dogruSayisi / toplamSoru) * 100) : 0
  const toplamPuan = Math.round(basariYuzdesi)

  // Sonucu Kaydet
  useEffect(() => {
    if (!location.state) {
      navigate('/')
      return
    }

    setTimeout(() => setAnimasyon(true), 300)

    if (basariYuzdesi >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    // Geçmişi kaydet
    const quizGecmisi = JSON.parse(localStorage.getItem('quiz_gecmisi') || '[]')
    const kullaniciAdi = localStorage.getItem('kullanici_adi')

    // Aynı ID ile kayıt var mı kontrol et (Double save önleme)
    const kayitVarMi = id && quizGecmisi.some(k => k.id === id)

    if (!kayitVarMi && id) {
      const yeniSonuc = {
        id,
        tarih: new Date().toISOString(),
        dogru: dogruSayisi,
        yanlis: yanlisSayisi,
        bos: bosSayisi,
        puan: toplamPuan,
        sure,
        soruTipi,
        detayliSonuclar // Eklendi
      }

      quizGecmisi.push(yeniSonuc)
      localStorage.setItem('quiz_gecmisi', JSON.stringify(quizGecmisi))

      // Backend'e kaydet (Liderlik Tablosu için)
      if (kullaniciAdi) {
        axios.post(`${API_URL}/skor`, {
          kullaniciAdi,
          puan: toplamPuan,
          dogru: dogruSayisi,
          yanlis: yanlisSayisi,
          bos: bosSayisi,
          soruTipi,
          sure
        }).catch(err => console.error("Skor kaydedilemedi:", err))
      }
    }

  }, [location.state, navigate, id, dogruSayisi, yanlisSayisi, bosSayisi, toplamPuan, sure, soruTipi, basariYuzdesi])

  const incelenecekSorular = detayliSonuclar
  const yanlisSorular = incelenecekSorular.filter(s => s.durum === 'yanlis')
  const bosSorular = incelenecekSorular.filter(s => s.durum === 'bos')


  const basariDurumu = () => {
    if (basariYuzdesi >= 90) return { mesaj: 'Mükemmel! 🎉', renk: 'text-yellow-400', bg: 'bg-yellow-500/20', aciklama: 'Efsanevi bir performans!' }
    if (basariYuzdesi >= 70) return { mesaj: 'Çok İyi! 👏', renk: 'text-green-400', bg: 'bg-green-500/20', aciklama: 'Harika bir iş çıkardın!' }
    if (basariYuzdesi >= 50) return { mesaj: 'Güzel! 👍', renk: 'text-blue-400', bg: 'bg-blue-500/20', aciklama: 'Başarılı, ama daha iyisini yapabilirsin.' }
    return { mesaj: 'Geliştirilmeli 📚', renk: 'text-orange-400', bg: 'bg-orange-500/20', aciklama: 'Biraz daha pratik yapmalısın.' }
  }

  const durum = basariDurumu()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 relative overflow-hidden bg-brand-dark">
      {/* Arkaplan */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-brand-dark to-brand-dark"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className={`
          glass-panel rounded-3xl p-8 
          transform transition-all duration-700
          ${animasyon ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'}
        `}>
          {/* Skor Kartı */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="relative mb-6">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${durum.bg} border-4 border-white/5 shadow-2xl animate-pulse`}>
                <Trophy className={`w-16 h-16 ${durum.renk}`} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-light border border-white/10 text-white font-mono px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                <Clock className="w-3 h-3 text-purple-400" /> {sure}
              </div>
            </div>

            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">{durum.mesaj}</h1>
            <p className="text-gray-400 text-lg">{durum.aciklama}</p>
          </div>

          {/* İstatistikler Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center hover:bg-green-500/20 transition-colors">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{dogruSayisi}</div>
              <div className="text-xs text-green-400 font-bold tracking-wider uppercase">DOĞRU</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center hover:bg-red-500/20 transition-colors">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{yanlisSayisi}</div>
              <div className="text-xs text-red-400 font-bold tracking-wider uppercase">YANLIŞ</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center hover:bg-orange-500/20 transition-colors">
              <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{bosSayisi}</div>
              <div className="text-xs text-orange-400 font-bold tracking-wider uppercase">BOŞ</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center hover:bg-blue-500/20 transition-colors">
              <div className="text-3xl mb-1">📊</div>
              <div className="text-xl font-bold text-white">% {basariYuzdesi}</div>
              <div className="text-xs text-blue-400 font-bold tracking-wider uppercase">BAŞARI</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* YANLIŞ CEVAPLAR LİSTESİ */}
            {yanlisSorular.length > 0 && (
              <div className="bg-red-900/20 rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center border-b border-red-500/30 pb-3">
                  <XCircle className="w-5 h-5 mr-3" />
                  Yanlış Cevaplarınız
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {yanlisSorular.map((soru, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-colors">
                      <p className="font-semibold text-gray-200 mb-3 text-sm leading-relaxed">{soru.soruMetni}</p>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-red-400/80">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="font-bold opacity-70">Sen:</span>
                          <span className="text-white">{soru.verilenCevap}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400/80">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="font-bold opacity-70">Doğru:</span>
                          <span className="text-white">{soru.dogruCevap}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOŞ BIRAKILANLAR LİSTESİ */}
            {bosSorular.length > 0 && (
              <div className="bg-orange-900/20 rounded-2xl p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center border-b border-orange-500/30 pb-3">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  Boş Bıraktıklarınız
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {bosSorular.map((soru, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                      <p className="font-semibold text-gray-200 mb-3 text-sm leading-relaxed">{soru.soruMetni}</p>

                      <div className="flex items-center gap-2 text-green-400/80 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="font-bold opacity-70">Cevap:</span>
                        <span className="text-white">{soru.dogruCevap}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-white/10 pt-8">
            <button
              onClick={() => navigate('/test', { state: { soruTipi } })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-10 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Dene
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-white/10 text-white py-4 px-10 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ana Sayfa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SonucEkrani
