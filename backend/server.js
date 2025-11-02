// Backend sunucu - Express.js ile REST API
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware'ler
app.use(cors()); // Frontend'den gelen isteklere izin ver
app.use(express.json()); // JSON verileri parse et

// Soru veritabanı yolu
const SORULAR_DOSYASI = path.join(__dirname, 'data', 'questions.json');

// Data klasörünü oluştur
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Eğer questions.json yoksa boş bir dizi ile oluştur
if (!fs.existsSync(SORULAR_DOSYASI)) {
  fs.writeFileSync(SORULAR_DOSYASI, JSON.stringify([], null, 2));
}

// ===== YARDIMCI FONKSİYONLAR =====
// (Artık dosya parse etmiyoruz - sorular direkt JSON'da)

// ===== API ENDPOINT'LERİ =====

// Ana sayfa - API durumu
app.get('/', (req, res) => {
  res.json({ 
    mesaj: 'Test Uygulaması API çalışıyor!',
    surum: '1.0.0'
  });
});

// Dosya yükleme özelliği kaldırıldı - Sorular direkt JSON dosyasında

// Tüm soruları getir
app.get('/api/sorular', (req, res) => {
  try {
    const sorular = JSON.parse(fs.readFileSync(SORULAR_DOSYASI, 'utf8'));
    res.json({ sorular, toplam: sorular.length });
  } catch (error) {
    console.error('Sorular getirme hatası:', error);
    res.status(500).json({ hata: 'Sorular yüklenemedi!' });
  }
});

// Rastgele N soru getir
app.get('/api/rastgele-sorular/:adet?', (req, res) => {
  try {
    let sorular = JSON.parse(fs.readFileSync(SORULAR_DOSYASI, 'utf8'));
    const adet = parseInt(req.params.adet) || sorular.length;
    const tip = req.query.tip; // URL'den tip parametresini al
    
    if (sorular.length === 0) {
      return res.status(404).json({ hata: 'Henüz soru yüklenmemiş!' });
    }
    
    // Soru tipine göre filtrele
    if (tip && tip !== 'tumu') {
      sorular = sorular.filter(soru => soru.tip === tip);
      
      if (sorular.length === 0) {
        return res.status(404).json({ hata: `${tip} tipinde soru bulunamadı!` });
      }
    }
    
    // Soruları karıştır ve istenen miktarda al
    const karisikSorular = [...sorular]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(adet, sorular.length));
    
    // Doğru cevapları gizle (sadece test bitiminde göster)
    const cevapsizSorular = karisikSorular.map(soru => {
      const { dogruCevap, ...soruBilgisi } = soru;
      return soruBilgisi;
    });
    
    res.json({ 
      sorular: cevapsizSorular,
      toplam: karisikSorular.length,
      // Cevapları ayrı bir yerde tut (frontend'den sonra kontrol için)
      cevaplar: karisikSorular.reduce((acc, soru) => {
        acc[soru.id] = soru.dogruCevap;
        return acc;
      }, {})
    });
    
  } catch (error) {
    console.error('Rastgele sorular getirme hatası:', error);
    res.status(500).json({ hata: 'Sorular yüklenemedi!' });
  }
});

// Cevap kontrol et
app.post('/api/cevap-kontrol', (req, res) => {
  try {
    const { soruId, kullaniciCevabi } = req.body;
    
    if (!soruId || !kullaniciCevabi) {
      return res.status(400).json({ hata: 'Soru ID ve cevap gerekli!' });
    }
    
    const sorular = JSON.parse(fs.readFileSync(SORULAR_DOSYASI, 'utf8'));
    const soru = sorular.find(s => s.id === soruId);
    
    if (!soru) {
      return res.status(404).json({ hata: 'Soru bulunamadı!' });
    }
    
    // Cevabı kontrol et (büyük/küçük harf duyarsız)
    const dogruCevap = soru.dogruCevap.toString().toLowerCase().trim();
    const kullaniciCevabiTemiz = kullaniciCevabi.toString().toLowerCase().trim();
    
    const dogruMu = dogruCevap === kullaniciCevabiTemiz;
    
    res.json({
      dogru: dogruMu,
      dogruCevap: soru.dogruCevap,
      aciklama: dogruMu ? 'Tebrikler, doğru cevap!' : 'Yanlış cevap!'
    });
    
  } catch (error) {
    console.error('Cevap kontrol hatası:', error);
    res.status(500).json({ hata: 'Cevap kontrol edilemedi!' });
  }
});

// Tüm soruları sil
app.delete('/api/sorular', (req, res) => {
  try {
    fs.writeFileSync(SORULAR_DOSYASI, JSON.stringify([], null, 2));
    res.json({ basarili: true, mesaj: 'Tüm sorular silindi!' });
  } catch (error) {
    console.error('Sorular silme hatası:', error);
    res.status(500).json({ hata: 'Sorular silinemedi!' });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Backend sunucu http://localhost:${PORT} adresinde çalışıyor!`);
  console.log(`📁 Soru dosyası: ${SORULAR_DOSYASI}`);
});
