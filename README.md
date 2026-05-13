# 🐼 Panda Koşusu — Oyun Projesi

> Japonya'nın çatılarında tehlikeli bir koşu macerası!

---

## 📖 Proje Hakkında

Bu proje, saf JavaScript ve HTML5 Canvas API kullanılarak geliştirilmiş 2D bir "endless runner" (sonsuz koşu) oyunudur. Oyunda bir pandayı kontrol ederek Japon çatıları üzerinde koşuyor, düşmanlardan kaçıyor ve hayatta kalmaya çalışıyorsunuz.
---

## 🎮 Nasıl Oynanır?

| Tuş | Aksiyon |
|-----|---------|
| `↑` / `Boşluk` | Zıpla (çift zıplama desteklenir!) |
| `↓` / `S` | Eğil |
| `Enter` / Fare tıklaması | Oyunu başlat / Menüye dön |

**Amaç:** Mümkün olduğunca uzun süre hayatta kal, yüksek skor yap!

---

## 👹 Düşmanlar

### Karakasa (Şemsiye Hayaleti)
- Çatılar üzerinde zıplar
- **Üzerinden atlayarak veya eğilerel** kaçınılabilir (+300 puan)
- Çarparsan can kaybedersin

### Rokurokubi (Uzun Boyunlu Yaratık)
- Pandaya **yapışır** ve hızını düşürür
- Dokunmamaya çalış, kaçınmak zor!
- Kalkan ile etkisiz hale getirilebilir

### Kitsune (Tilki Ruhu)
- **Ateş topu** fırlatır, pandayı hedef alır
- Ateş toplarından eğilerek veya zıplayarak kaçabilirsin
- Level arttıkça daha sık ateş eder

### Bake-Zori (Canlanan Sandalet) 🥿
- Çatılar üzerinde durur, bekler
- **Üzerinden atlayarak** geçilmeli

### Düşen Lambalar 🏮
- Rastgele yukarıdan düşer
- Dikkatli ol, sağdan soldan gelebilir!

---

## 💎 Toplanabilir Objeler

| Obje | Efekt |
|------|-------|
| 🛡️ Mavi Kalkan | 5 saniyelik hasar koruması sağlar |
| 🎋 Bambu | +1 can verir (maksimum 5 can). Maksimum candaysan +300 puan |

---

## ⚙️ Teknik Detaylar

### Kullanılan Teknolojiler
- **Dil:** Saf JavaScript (ES6+)
- **Grafik:** HTML5 Canvas API
- **Ses:** Web Audio API (HTML Audio elementi ile)
- **Veri Saklama:** `localStorage` (en yüksek skor kaydı)

### Proje Yapısı

```
proje/
│
├── index.html          # Oyunun ana HTML dosyası
├── panda.js             # Tüm oyun mantığı (bu dosya!)
│
├── arkaplan.png        # Arka plan görseli 1
├── arkaplan2.png       # Arka plan görseli 2
├── ev9.png             # Ev/çatı görseli
│
├── pandamm.png         # Panda yürüme karesi 1
├── yuruyenorta.png     # Panda yürüme karesi 2
├── zıpla1.png          # Panda zıplama animasyonu karesi 1
├── zıpla2.png          # Panda zıplama animasyonu karesi 2
├── zıpla3.png          # Panda zıplama animasyonu karesi 3
│
├── dusman1.png         # Rokurokubi görseli
├── dusman2.png         # Karakasa görseli
├── dusman3.png         # Kitsune görseli
├── atestopu.png        # Kitsune'nin ateş topu görseli
├── bakezori.png        # Bake-zori görseli
│
├── zıplama.mp3         # Zıplama sesi
├── gameover.mp3        # Oyun bitti sesi
├── bonus.mp3           # Kalkan / can toplama sesi
├── menu.mp3            # Menü müziği
├── arkaplan.mp3        # Oyun içi müzik
└── punch.mp3           # Hasar / düşman yenilgisi sesi
```

### Önemli Sabitler

```javascript
const yercekimi   = 0.75;   // Yerçekimi kuvveti
const ziplamagucu = -19;    // Zıplama hızı (negatif = yukarı)
let   oyun_hiz    = 1.9;    // Başlangıç oyun hızı
const maxcan      = 5;      // Maksimum can sayısı
```

### Oyun Döngüsü

Oyun `requestAnimationFrame` ile çalışan klasik bir game loop üzerine kurulu:

```
requestAnimationFrame
    └── oyunDongusu()
            ├── pandayiGuncelle()   → fizik, çarpışma, düşman mantığı
            └── sahneyiCiz()        → canvas'a tüm nesneleri çiz
```

### Level Sistemi

Her **1000 puan**da bir yeni level açılır:
- Oyun hızı artar (`+0.2`)
- Düşman hızı artar (`+0.15`)
- Kitsune daha sık ateş eder
- Karakasa daha hızlı zıplar

---

## 🐛 Bilinen Sorunlar / Geliştirilebilecek Yerler

- [ ] Mobil / dokunmatik ekran desteği yok
- [ ] Ses dosyaları bazı tarayıcılarda otomatik oynatılamayabiliyor (kullanıcı etkileşimi gerekli — bu tarayıcı politikasından kaynaklanıyor)
- [ ] Düşman spawn sistemi tamamen rastgele, bazen üst üste gelebiliyor
- [ ] Oyun sadece tek bir arka plan döngüsüne sahip, çeşitlilik eklenebilir

---

## 🚀 Kurulum ve Çalıştırma

🌐 Oyun Linki (GitHub Pages)
https://tugbatubay.github.io/Panda-Roof-Runner/
Herhangi bir kurulum gerektirmez! Sadece dosyaları aynı klasöre koy ve `index.html` dosyasını bir tarayıcıda aç.

> ⚠️ **Not:** Ses ve görsel dosyaların `panda.js` ile **aynı klasörde** olması gerekiyor. Aksi halde görseller ve sesler yüklenemez.


## 👨‍💻 Geliştirici Notları

Bu proje geliştirilirken özellikle şu konulara dikkat edildi:

- **Bellek yönetimi:** Ekrandan çıkan düşmanlar ve objeler diziden temizleniyor, aksi halde zamanla hafıza şişer
- **Çarpışma hassasiyeti:** Hit-box'lar görsel boyuttan biraz küçük tutuldu — bu sayede oyun "haksız" hissettirmiyor.Denendi ve onaylandı :).
- **Ses sistemi:** `cloneNode()` kullanılarak aynı ses üst üste çalınabiliyor (özellikle zıplama için önemli)
- **Sonsuz arkaplan:** İki arkaplan resmi sırayla konumlandırılıp döngüsel kaydırma efekti yaratıldı. İki görsel aslında aynı sadece yansıma kullanıldı.

