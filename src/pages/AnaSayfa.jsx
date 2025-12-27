// Ana sayfa - Kullanıcı buradan teste başlar veya soru yükler
import { useNavigate } from 'react-router-dom'
import { BookOpen, Trophy, Clock, History, User, PlayCircle, BarChart2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

function AnaSayfa() {
  const navigate = useNavigate()
  const [soruSayisi, setSoruSayisi] = useState(0)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kullaniciAdi, setKullaniciAdi] = useState('')
  const [isimModalAcik, setIsimModalAcik] = useState(false)
  const [gecmisSkorlar, setGecmisSkorlar] = useState([])
  const [girilenIsim, setGirilenIsim] = useState('')

  // Liderlik Tablosu State
  const [liderlikTablosu, setLiderlikTablosu] = useState([])
  const [skorFiltresi, setSkorFiltresi] = useState('tumu')

  // Liderlik Tablosunu Getir
  useEffect(() => {
    axios.get(`${API_URL}/skorlar?type=${skorFiltresi}`)
      .then(res => setLiderlikTablosu(res.data))
      .catch(err => console.error('Skorlar alınamadı', err))
  }, [skorFiltresi])

  // Sayfa yüklendiğinde
  useEffect(() => {
    // Soru sayısını al
    axios.get(`${API_URL}/sorular`)
      .then(response => {
        setSoruSayisi(response.data.toplam)
        setYukleniyor(false)
      })
      .catch(error => {
        console.error('Soru sayısı alınamadı:', error)
        setYukleniyor(false)
      })

    // Kullanıcı adı kontrolü
    const kayitliIsim = localStorage.getItem('kullanici_adi')
    if (kayitliIsim) {
      setKullaniciAdi(kayitliIsim)
    } else {
      setIsimModalAcik(true)
    }

    // Geçmiş skorları al
    const skorlar = JSON.parse(localStorage.getItem('quiz_gecmisi') || '[]')
    setGecmisSkorlar(skorlar.reverse().slice(0, 5)) // Son 5 skor
  }, [])

  const isimKaydet = () => {
    if (girilenIsim.trim()) {
      localStorage.setItem('kullanici_adi', girilenIsim.trim())
      setKullaniciAdi(girilenIsim.trim())
      setIsimModalAcik(false)
    }
  }

  const testeBasla = (soruTipi) => {
    if (soruSayisi === 0) {
      alert('Henüz soru yüklenmemiş!')
      return
    }
    navigate('/test', { state: { soruTipi } })
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Arkaplan Efektleri */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* İsim Modalı */}
      {isimModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel p-8 rounded-2xl w-full max-w-md text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Hoş Geldin! 👋</h2>
            <p className="text-gray-300 mb-6">Skor tablosunda yer almak için lütfen adını gir.</p>
            <input
              type="text"
              value={girilenIsim}
              onChange={(e) => setGirilenIsim(e.target.value)}
              placeholder="Adınız Soyadınız"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-6"
            />
            <button
              onClick={isimKaydet}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Başla
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Üst Başlık ve Kullanıcı */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2 text-glow">
              Yapay Zeka Uygulamaları I
            </h1>
            <p className="text-gray-400 text-lg">30.12.2025 | Salı | 15.00</p>
          </div>

          {kullaniciAdi && (
            <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                {kullaniciAdi.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-gray-400">Hoş Geldin,</div>
                <div className="text-white font-semibold">{kullaniciAdi}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ----- SOL KOLON (GENİŞ) ----- */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. İstatistik Kartı */}
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/30 transition-all duration-700"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Hazır mısın?</h2>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Kendini geliştirmek için hemen teste başla. Toplam {soruSayisi} soru seni bekliyor.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => testeBasla('tumu')}
                      className="bg-white text-purple-900 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                    >
                      <PlayCircle className="w-5 h-5" /> Tümüyle Başla
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-white/90 drop-shadow-2xl">{soruSayisi}</div>
                  <div className="text-purple-200 uppercase tracking-widest text-xs font-bold mt-2">Soru Hazır</div>
                </div>
              </div>
            </div>

            {/* 2. Test Tipleri Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <button onClick={() => testeBasla('coktan-secmeli')} className="glass-button p-6 rounded-2xl text-left group hover:border-purple-500/50">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Çoktan Seçmeli</h3>
                <p className="text-sm text-gray-400">Standart şıklı test formatı</p>
              </button>

              <button onClick={() => testeBasla('bosluk-doldurma')} className="glass-button p-6 rounded-2xl text-left group hover:border-purple-500/50">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Boşluk Doldurma</h3>
                <p className="text-sm text-gray-400">Kelime bilginizi ölçün</p>
              </button>

              <button onClick={() => testeBasla('klasik')} className="glass-button p-6 rounded-2xl text-left group hover:border-purple-500/50">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Klasik Sorular</h3>
                <p className="text-sm text-gray-400">Kendinizi deneyin</p>
              </button>
            </div>

            {/* 3. LİDERLİK TABLOSU (Buraya Taşındı) */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Liderlik Tablosu
                </h3>
              </div>

              {/* Filtre Butonları */}
              <div className="flex p-1 bg-white/5 rounded-xl mb-4">
                {[
                  { id: 'tumu', label: 'Tümü' },
                  { id: 'coktan-secmeli', label: 'Test' },
                  { id: 'bosluk-doldurma', label: 'Boşluk' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSkorFiltresi(tab.id)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all
                            ${skorFiltresi === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}
                        `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                {liderlikTablosu.length > 0 ? (
                  liderlikTablosu.map((skor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                      <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${index === 0 ? 'bg-yellow-500 text-yellow-900 border border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                          index === 1 ? 'bg-slate-300 text-slate-900 border border-slate-400 shadow-[0_0_10px_rgba(203,213,225,0.3)]' :
                            index === 2 ? 'bg-orange-400 text-orange-900 border border-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.3)]' :
                              'bg-white/10 text-gray-400'}
                            `}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm truncate">{skor.kullaniciAdi}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span className={skor.dogru >= skor.yanlis ? 'text-green-400' : 'text-red-400'}>
                            %{Math.round((skor.dogru / (skor.dogru + skor.yanlis + skor.bos)) * 100) || 0}
                          </span>
                          • {skor.soruTipi === 'coktan-secmeli' ? 'Test' : 'Boşluk'}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-purple-300 font-bold">{skor.puan} P</div>
                        <div className="text-[10px] text-gray-500">{new Date(skor.tarih).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Henüz veri yok.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ----- SAĞ KOLON (DAR) ----- */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. Şık Dağılım Tablosu (Hardcoded) */}
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" />
                Genel Dağılım
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-300 font-medium">A Şıkkı</span>
                  <span className="text-white font-bold">148 Adet</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-300 font-medium">B Şıkkı</span>
                  <span className="text-white font-bold">105 Adet</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-300 font-medium">C Şıkkı</span>
                  <span className="text-white font-bold">2 Adet</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-900/40 border border-purple-500/30">
                  <span className="text-purple-300 font-medium">D Şıkkı</span>
                  <div className="text-right">
                    <div className="text-white font-bold opacity-50 text-xs">0 Adet</div>
                    <div className="text-purple-400 font-extrabold">(D işaretleyen GAY)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Son Aktivitelerim (Buraya Taşındı) */}
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-pink-400" />
                Son Aktivitelerim
              </h3>

              <div className="space-y-3">
                {gecmisSkorlar.length > 0 ? (
                  gecmisSkorlar.map((skor, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">{new Date(skor.tarih).toLocaleDateString()}</span>
                          <span className="text-xs font-bold text-white mt-0.5">
                            {skor.soruTipi === 'coktan-secmeli' ? 'Test - Çoktan Seçmeli' :
                              skor.soruTipi === 'bosluk-doldurma' ? 'Test - Boşluk Doldurma' :
                                skor.soruTipi === 'klasik' ? 'Test - Klasik' : 'Test - Genel'}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-purple-300 bg-purple-900/40 px-2 py-1 rounded-lg">{skor.sure}</div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="font-bold text-white text-lg">{skor.puan} Puan</div>
                        <button
                          onClick={() => {
                            if (skor.detayliSonuclar) {
                              navigate('/sonuc', { state: { ...skor, detayliSonuclar: skor.detayliSonuclar } })
                            } else {
                              alert('Bu test için detaylı veri bulunamadı (Eski kayıt).')
                            }
                          }}
                          className="bg-white/10 hover:bg-purple-500 hover:text-white text-gray-300 text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Detay
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Henüz test çözmedin.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AnaSayfa
