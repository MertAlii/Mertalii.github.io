# 🚀 Hızlı Başlangıç - Test Uygulaması

## 📦 İlk Kurulum (Sadece bir kez)

```bash
# 1. Root klasörde bağımlılıkları yükle
npm install

# 2. Tüm proje bağımlılıklarını yükle
npm run install:all
```

## 🎯 Uygulamayı Çalıştır

```bash
npm start
```

**Tek bir komut!** Bu komut hem backend (port 5000) hem de frontend (port 3000) başlatır! 🎉

## 🌐 Tarayıcıda Aç

- **Frontend**: http://localhost:3000 
- **Backend API**: http://localhost:5000

## ✨ Özellikler

- 25+ Arduino ve ESP32 sorusu hazır
- Çoktan seçmeli ve boşluk doldurma soruları
- Anında doğru/yanlış geri bildirimi
- Modern ve responsive tasarım

## 📝 Soru Ekleme

`backend/data/questions.json` dosyasını düzenleyerek yeni sorular ekleyebilirsiniz.

**Örnek Format:**

```json
{
  "id": 1026,
  "tip": "coktan-secmeli",
  "soruMetni": "Arduino'da kaç adet PWM pini vardır?",
  "dogruCevap": "C",
  "siklar": [
    {"harf": "A", "metin": "4"},
    {"harf": "B", "metin": "8"},
    {"harf": "C", "metin": "6"},
    {"harf": "D", "metin": "10"}
  ]
}
```

---

**İlk kez mi? Önce `npm run install:all` komutunu çalıştırın!** 🚀
