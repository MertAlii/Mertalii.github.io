// Soru yükleme sayfası - Kullanıcı buradan Word veya TXT dosyası yükler
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowLeft, FileText, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import api from '../config/api'

function SoruYukleme() {
  const navigate = useNavigate()
  const [dosya, setDosya] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [sonuc, setSonuc] = useState(null)
  const [hata, setHata] = useState(null)

  // Dosya seçildiğinde
  const dosyaSec = (event) => {
    const secilenDosya = event.target.files[0]
    
    if (!secilenDosya) return
    
    // Dosya uzantısını kontrol et
    const uzanti = secilenDosya.name.split('.').pop().toLowerCase()
    if (uzanti !== 'docx' && uzanti !== 'txt') {
      setHata('Sadece .docx ve .txt dosyaları yüklenebilir!')
      setDosya(null)
      return
    }
    
    setDosya(secilenDosya)
    setHata(null)
    setSonuc(null)
  }

  // Dosyayı sunucuya yükle
  const dosyaYukle = async () => {
    if (!dosya) {
      setHata('Lütfen önce bir dosya seçin!')
      return
    }

    setYukleniyor(true)
    setHata(null)
    setSonuc(null)

    try {
      // FormData oluştur
      const formData = new FormData()
      formData.append('dosya', dosya)

      // Backend'e gönder
      const response = await axios.post(api.url('/api/dosya-yukle'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Başarılı
      setSonuc(response.data)
      setDosya(null)
      
      // Dosya input'unu temizle
      document.getElementById('dosya-input').value = ''
      
    } catch (error) {
      console.error('Dosya yükleme hatası:', error)
      setHata(error.response?.data?.hata || 'Dosya yüklenirken bir hata oluştu!')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => navigate('/')}
          className="text-white mb-8 flex items-center hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Ana Sayfaya Dön
        </button>

        {/* Ana Kart */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 fade-in">
          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Upload className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Soru Yükle
            </h1>
            <p className="text-gray-600">
              Word (.docx) veya TXT (.txt) formatında dosya yükleyin
            </p>
          </div>

          {/* Dosya Yükleme Alanı */}
          <div className="mb-6">
            <label 
              htmlFor="dosya-input"
              className="
                flex flex-col items-center justify-center
                border-3 border-dashed border-blue-300 rounded-2xl
                p-12 cursor-pointer
                hover:border-blue-500 hover:bg-blue-50
                transition-all duration-300
              "
            >
              <FileText className="w-16 h-16 text-blue-400 mb-4" />
              <span className="text-lg font-semibold text-gray-700 mb-2">
                {dosya ? dosya.name : 'Dosya Seçin'}
              </span>
              <span className="text-sm text-gray-500">
                veya sürükle bırak
              </span>
              <input
                id="dosya-input"
                type="file"
                accept=".docx,.txt"
                onChange={dosyaSec}
                className="hidden"
              />
            </label>
          </div>

          {/* Yükleme Butonu */}
          <button
            onClick={dosyaYukle}
            disabled={!dosya || yukleniyor}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg
              transition-all duration-300
              ${!dosya || yukleniyor
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white btn-hover'}
            `}
          >
            {yukleniyor ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Yükleniyor...
              </div>
            ) : (
              'Dosyayı Yükle ve Parse Et'
            )}
          </button>

          {/* Sonuç Mesajları */}
          {sonuc && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-start fade-in">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">
                  {sonuc.mesaj}
                </h3>
                <p className="text-sm text-green-700">
                  Yüklenen Soru: {sonuc.yukleneSoruSayisi} | 
                  Toplam: {sonuc.toplamSoruSayisi}
                </p>
              </div>
            </div>
          )}

          {hata && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start fade-in">
              <XCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Hata!</h3>
                <p className="text-sm text-red-700">{hata}</p>
              </div>
            </div>
          )}

          {/* Kullanım Talimatları */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-3">
              📝 Dosya Formatı Kuralları:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Her soru "1.", "2." gibi numaralarla başlamalı</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Çoktan seçmeli sorularda A), B), C), D) şıkları olmalı</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Doğru cevabı * veya ✓ ile işaretleyin</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Boşluk doldurma soruları için "Cevap: ..." ekleyin</span>
              </li>
            </ul>
          </div>

          {/* Örnek Format */}
          <div className="mt-6 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-3">
              ✨ Örnek Format:
            </h3>
            <pre className="text-xs text-gray-700 bg-white p-4 rounded-lg overflow-x-auto">
{`1. Türkiye'nin başkenti neresidir?
A) İstanbul
B) Ankara *
C) İzmir
D) Bursa

2. 2 + 2 = ?
Cevap: 4`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoruYukleme
