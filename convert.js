const fs = require('fs');

// JSON dosyalarını oku
const json1 = JSON.parse(fs.readFileSync('json1.txt', 'utf8'));
const json2 = JSON.parse(fs.readFileSync('json2.txt', 'utf8'));

const sorular = [];
let id = 1;

// json1'den çoktan seçmeli soruları al
if (json1['bölüm_1_çoktan_seçmeli']) {
  json1['bölüm_1_çoktan_seçmeli'].forEach(s => {
    sorular.push({
      id: id++,
      tip: 'coktan-secmeli',
      soruMetni: s.soru_metni,
      dogruCevap: s.doğru_cevap.toUpperCase(),
      siklar: Object.entries(s.seçenekler).map(([k, v]) => ({
        harf: k.toUpperCase(),
        metin: v
      }))
    });
  });
}

// json1'den boşluk doldurma soruları al
if (json1['bölüm_2_boşluk_doldurma']) {
  json1['bölüm_2_boşluk_doldurma'].forEach(s => {
    sorular.push({
      id: id++,
      tip: 'bosluk-doldurma',
      soruMetni: s.soru_metni,
      dogruCevap: s.doğru_cevap
    });
  });
}

// json2'den tüm bölümleri al
Object.keys(json2).forEach(key => {
  if (Array.isArray(json2[key])) {
    json2[key].forEach(s => {
      if (s.doğru_cevap && !s.seçenekler) {
        // Boşluk doldurma sorusu
        sorular.push({
          id: id++,
          tip: 'bosluk-doldurma',
          soruMetni: s.soru_metni,
          dogruCevap: s.doğru_cevap
        });
      } else if (s.seçenekler) {
        // Çoktan seçmeli soru
        sorular.push({
          id: id++,
          tip: 'coktan-secmeli',
          soruMetni: s.soru_metni,
          dogruCevap: s.doğru_cevap.toUpperCase(),
          siklar: Object.entries(s.seçenekler).map(([k, v]) => ({
            harf: k.toUpperCase(),
            metin: v
          }))
        });
      }
    });
  }
});

// questions.json'a yaz
fs.writeFileSync('backend/data/questions.json', JSON.stringify(sorular, null, 2));

console.log(`✅ Başarıyla ${sorular.length} soru dönüştürüldü!`);
console.log(`   - Çoktan seçmeli: ${sorular.filter(s => s.tip === 'coktan-secmeli').length}`);
console.log(`   - Boşluk doldurma: ${sorular.filter(s => s.tip === 'bosluk-doldurma').length}`);
