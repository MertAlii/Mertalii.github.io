# 📚 Test Uygulaması

Modern ve kullanıcı dostu bir web tabanlı test uygulaması. Kullanıcılar Word veya TXT formatında soru dosyası yükleyebilir ve rastgele sorularla test olabilirler.

## ✨ Özellikler

- 🎯 **Hazır Sorular**: 25+ Arduino ve ESP32 sorusu hazır
- 🎲 **Rastgele Soru Seçimi**: Her test için rastgele sorular
- 📝 **İki Soru Tipi**: 
  - Çoktan seçmeli (A, B, C, D)
  - Boşluk doldurma
- ✅ **Anında Geri Bildirim**: Her cevap sonrası doğru/yanlış bilgisi
- 📊 **Skor Takibi**: Doğru/yanlış sayısı ve başarı yüzdesi
- 🎨 **Modern Arayüz**: TailwindCSS ile şık ve responsive tasarım
- 🚀 **Hızlı ve Kolay**: Kullanıcı girişi yok, direkt teste başla

## 🛠️ Teknolojiler

### Backend
- **Node.js** + **Express.js**: RESTful API
- **Multer**: Dosya yükleme
- **Mammoth**: Word dosyası parse etme
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern UI library
- **Vite**: Hızlı build tool
- **React Router**: Sayfa yönlendirme
- **Axios**: HTTP istekleri
- **TailwindCSS**: Modern styling
- **Lucide React**: İkonlar

## 📁 Proje Yapısı

```
QuestionSite/
├── backend/                 # Backend servisi
│   ├── server.js           # Ana sunucu dosyası
│   ├── data/               # Soru veritabanı
│   │   └── questions.json  # JSON formatında sorular
│   ├── uploads/            # Yüklenen dosyalar (geçici)
│   └── package.json
│
└── frontend/               # Frontend uygulaması
    ├── src/
    │   ├── pages/          # Sayfa bileşenleri
    │   │   ├── AnaSayfa.jsx
    │   │   ├── SoruYukleme.jsx
    │   │   ├── TestEkrani.jsx
    │   │   └── SonucEkrani.jsx
    │   ├── App.jsx         # Ana uygulama
    │   ├── main.jsx        # Giriş noktası
    │   └── index.css       # Global stiller
    ├── index.html
    └── package.json
```

## 🚀 Kurulum ve Çalıştırma

### ⚡ Hızlı Başlangıç (Önerilen)

```bash
# 1. Root klasörde bağımlılıkları yükle (sadece ilk kez)
npm install
npm run install:all

# 2. Uygulamayı tek komutla başlat
npm start
```

Bu komut hem backend (port 5000) hem de frontend (port 3000) aynı anda başlatır! 🎉

### 🔧 Manuel Kurulum (Alternatif)

#### 1. Backend Kurulumu

```bash
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm start
```

Backend `http://localhost:5000` adresinde çalışacak.

#### 2. Frontend Kurulumu

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Development sunucusunu başlat
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak.

## 📖 Kullanım

### Çok Basit! 3 Adımda Test

1. **Uygulamayı Başlatın**: `npm start` ile hem backend hem frontend başlar
2. **Tarayıcıda Açın**: `http://localhost:3000` adresine gidin
3. **Teste Başlayın**: "Teste Başla" butonuna tıklayın ve cevaplamaya başlayın!

### Test Sırasında

- Her soruyu cevapladıktan sonra "Cevabı Kontrol Et" yapın
- ✅ Doğru cevaplarda yeşil, ❌ yanlışlarda kırmızı bildirim görürsünüz
- "Sonraki Soru" ile devam edin
- Test bitiminde skorunuzu ve başarı yüzdenizi görün

### Sorular Nasıl?

- **25+ Arduino ve ESP32 sorusu** hazır olarak gelir
- Hem **çoktan seçmeli** hem **boşluk doldurma** soruları var
- `backend/data/questions.json` dosyasından yeni sorular ekleyebilirsiniz

## 🎯 API Endpoint'leri

### `GET /api/sorular`
Tüm soruları getir

### `GET /api/rastgele-sorular/:adet`
Rastgele N adet soru getir (varsayılan 20)

### `POST /api/cevap-kontrol`
Cevap doğruluğunu kontrol et

## 🎨 Özelleştirme

### Soru Sayısını Değiştirme
`frontend/src/pages/TestEkrani.jsx` dosyasında:
```javascript
axios.get('http://localhost:5000/api/rastgele-sorular/20') // 20 yerine istediğiniz sayıyı yazın
```

### Renk Teması
`frontend/tailwind.config.js` dosyasında `colors` bölümünü düzenleyin.

### Port Değiştirme
- **Backend**: `backend/server.js` - `PORT = 5000`
- **Frontend**: `frontend/vite.config.js` - `port: 3000`

## 🐛 Sorun Giderme

### Backend Başlamıyor
- Node.js yüklü olduğundan emin olun: `node --version`
- Port 5000 meşgul olabilir, farklı bir port deneyin
- `npm install` komutunu tekrar çalıştırın

### Frontend Başlamıyor
- `node_modules` klasörünü silin ve `npm install` yapın
- Tarayıcı önbelleğini temizleyin
- Port 3000 kullanımda olabilir

### Sorular Yüklenmiyor
- Backend'in çalıştığından emin olun
- CORS hatası için backend sunucusunu kontrol edin
- Dosya formatının doğru olduğunu kontrol edin

## 🌐 GitHub Pages Deployment

Bu proje GitHub Pages'te çalışacak şekilde yapılandırılmıştır.

### ⚠️ Önemli Notlar

1. **Backend Ayrı Deploy Edilmeli**: GitHub Pages sadece statik dosyalar sunar. Backend API'yi ayrı bir platforma (Railway, Render, Heroku, vb.) deploy etmeniz gerekir.

2. **Environment Variables**: 
   - Backend URL'inizi GitHub Secrets'a ekleyin: `VITE_API_BASE_URL`
   - Settings → Secrets and variables → Actions → New repository secret

### 🚀 Deployment Adımları

1. **Backend'i Deploy Edin**:
   - Railway, Render veya başka bir platforma backend'i deploy edin
   - Backend URL'ini not edin (örn: `https://your-backend.railway.app`)

2. **GitHub Secrets Ayarlayın**:
   - Repository → Settings → Secrets and variables → Actions
   - Yeni secret ekleyin: `VITE_API_BASE_URL` = Backend URL'iniz

3. **GitHub Pages'i Aktifleştirin**:
   - Repository → Settings → Pages
   - Source: "GitHub Actions" seçin

4. **Otomatik Deploy**:
   - `main` veya `master` branch'e push yaptığınızda otomatik deploy başlar
   - Actions sekmesinden deploy durumunu takip edebilirsiniz

### 📝 Repo Adına Göre Base Path

- **`username.github.io`** formatındaysa: Base path boş (root domain)
- **Diğer repo adları**: Base path otomatik olarak `/repo-adi/` olarak ayarlanır

Workflow dosyası (`.github/workflows/deploy.yml`) otomatik olarak bunu yönetir.

## 📝 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz!

## 👨‍💻 Geliştirici

Bu proje modern web teknolojileri kullanılarak geliştirilmiştir.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır! Büyük değişiklikler için lütfen önce bir issue açın.

---

**Not**: Bu uygulama eğitim amaçlıdır. Production ortamı için güvenlik önlemleri eklenmelidir.
