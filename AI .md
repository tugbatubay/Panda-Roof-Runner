# 🤖 Yapay Zeka Kullanım Raporu — AI.md

Proje geliştirme sürecinde **Claude**, **ChatGPT** ve **Google Gemini** kullanılmıştır.  
Aşağıda kullandığım araçlar, hangi konularda yardım aldığım ve aldığım cevapların büyük kısmı yer almaktadır.

---

## Genel Kullanım Özeti

| Konu | Yapay Zeka Kullandım mı? |
|------|--------------------------|
| Oyun fikri ve tema | ❌ Hayır — tamamen bana ait |
| Düşman davranış mantığı | ❌ Hayır — ben yazdım |
| Çarpışma (hit-box) ayarları | ❌ Hayır — deneme yanılma ile ben ayarladım |
| Renk ve görsel tercihler | ❌ Hayır — bana ait |
| Panda sprite'ı oluşturma | ✅ Evet — AI ile ürettim. Ancak sticker daha sonra png hale getirme tamamen bana ait |
| Kitsune ateş topu görseli | ✅ Evet — AI ile ürettim .Ancak sticker daha sonra png hale getirme tamamen bana ait|
| Bambu yaprak animasyonu kodu | ✅ Evet — AI yazdı |
| Arka plan katman sorunu | ✅ Evet — AI düzeltti |
| Japon mitolojisi araştırması | ✅ Evet — Gemini'ye sordum |
| Ses dosyası ekleme | ✅ Evet — sordum |
| `addEventListener` kullanımı | ✅ Evet — sordum |
| `forEach` kullanımı | ✅ Evet — sordum |
| Görseller (ev, düşman vb.) | ❌ Hayır — internetten bulup sticker'a çevirdim |
| Ses dosyaları | ❌ Hayır — internetten ücretsiz indirdim |

---

## Kullanılan Araçlar

- **Claude (Anthropic)** — kod yazımı, hata ayıklama, bellek yönetimi önerisi, ses ekleme, forEach, addEventListener
- **ChatGPT / Gemini** — görsel üretimi, araştırma, bambu kodu, arka plan katman düzeltmesi

---

## Prompt ve Cevaplar

---

### 💬 Konuşma 1 — Panda Sprite Üretimi

**Kullandığım araç:** ChatGPT (görsel üretim)

**Benim promptum:**
> bunu 2d oyun için koşan hallerini ve zıplayan hallerini yap az olsun karmaşık olmasın

*(Bir panda görseli yükleyerek koşma ve zıplama animasyon kareleri istedim)*

**Aldığım cevap:**
> Koşma için 3 kare (yürüyüş animasyonu) ve zıplama için 3 kare üretildi. Sade, pixel-art tarzına yakın, arka plansız karakterler.

*(Görsel çıktı: 3 koşma karesi + 3 zıplama karesi)*

**Ne yaptım:**
Üretilen karelerden işime yarayanları seçtim. Koşma için 2 kare (`pandamm.png`, `yuruyenorta.png`), zıplama için 3 kare (`zıpla1.png`, `zıpla2.png`, `zıpla3.png`) olarak kaydedip oyuna ekledim.Bu görselleri önce kestim sonra sticker hale getirip png olarak kaydettim .

---

### 💬 Konuşma 2 — Kitsune Ateş Topu Görseli

**Kullandığım araç:** ChatGPT (görsel üretim)

**Benim promptum:**
> kitsunebi ateş topunu çiz arka plan olmadan tilkisiz olsun

**Aldığım cevap:**
> Mavi-yeşil alevlerle çevrili, spiral desenli bir ateş topu üretildi. Arka plansız, transparan görünümlü.

*(Görsel çıktı: mavi alevli spiral ateş topu)*

**Ne yaptım:**
Bu görseli önce kestim sonra sticker hale getirip png olarak kaydettim .
---

### 💬 Konuşma 3 — Ev Görsellerini Hizalama

**Kullandığım araç:** ChatGPT

**Benim promptum:**
> buradaki butun evleri yanyana diz aralarında boşluk olmasın ve çatı boylarını eşitle lütfen

*(Japon evi görselleri yükleyerek hizalama istedim)*

**Aldığım cevap:**
> Evlerin çatı yükseklikleri eşitlenerek yan yana dizilmiş hali üretildi, aralarında boşluk bırakılmadı.

**Ne yaptım:**
Bu hizalanmış görselden tek evi (`ev9.png`) seçip oyunda kullandım. Çatı hizasını tutarlı hale getirmek oyundaki `offset_cati` değerini ayarlamayı kolaylaştırdı.

---

### 💬 Konuşma 4 — Japon Mitolojisi Araştırması

**Kullandığım araç:** Google Gemini

**Benim promptum:**
> japon mitolojisinde boyle havadan düşen seyler var mı?

**Aldığım cevap:**
> Japon mitoloji ve halk inanışlarında (yokai kültürü) gökten düşen şeyler oldukça popüler ve çeşitlidir. Sadece yağmur veya kar değil; canlılar, nesneler ve hatta görünmez taşlar bile havadan "yağabilir".
>
> Öne çıkan örnekler:
> - **Raiju (Gök Gürültüsü Canavarı):** Şimşek çaktığında gökten yere düştüğüne inanılan mitolojik bir yaratık.
> - **Tengu-tsubute (Tengu'nun Attığı Taşlar):** Dağlarda veya bazen şehirlerde aniden havadan taş ve çakıl yağması fenomeni.

**Ne yaptım:**
Bu araştırmadan düşen lambalar (`dusen_lambalar`) fikri çıktı. Japonya'da gökten düşen nesneler mitolojide var olduğu için oyuna tematik olarak uygun bir engel olarak ekledim.

---

### 💬 Konuşma 5 — Bambu Yaprak Animasyonu

**Kullandığım araç:** ChatGPT

**Benim promptum:**
> bambu yaptım  yaprakları nasıl olabilir nasıl ekleyebilirim

**Aldığım cevap:**
> Bambulara yaprak eklemek için `bambuCiz` fonksiyonunu biraz daha detaylandıralım. Her boğumun yanından çıkan küçük, asimetrik yeşil yapraklar ekleyerek oyunun görselliğini çok daha şık bir hale getirebiliriz.
>
> ```javascript
> function bambuCiz(ctx, x, yCati, genislik, yukseklik, havaOffset) {
>     ctx.save();
>     let yTaban = yCati - havaOffset;
>     let yUst = yTaban - yukseklik;
>     const bogumSayisi = Math.max(2, Math.floor(yukseklik / 25));
>     const bogumYuksekligi = yukseklik / bogumSayisi;
>
>     for (let i = 0; i < bogumSayisi; i++) {
>         let bY = yUst + (i * bogumYuksekligi);
>         // Gövde Çizimi
>         ctx.fillStyle = i % 2 === 0 ? '#5DBB4A' : '#4CAF50';
>         ctx.fillRect(x, bY, genislik, bogumYuksekligi);
>         ctx.strokeStyle = '#2E7D32';
>         ctx.lineWidth = 2;
>         ctx.strokeRect(x, bY, genislik, bogumYuksekligi);
>         // Yaprak Çizimi — Her boğumun yanından rastgele bir yaprak çıksın
>     }
> }
> ```

**Ne yaptım:**
Bu kod önerisini aldım, fonksiyon parametrelerini kendi oyunuma göre sadeleştirdim. Renk değerlerini ve boyutları kendim ayarladım, `+1 ❤️` yazısını ve sallanma efektini (`Math.sin`) kendim ekledim.Matsin araştırmalarım sonucu buldum

---

### 💬 Konuşma 6 — Arka Plan Katman Sorunu

**Kullandığım araç:** ChatGPT

**Benim promptum:**
> *(Arka planların üst üste bindiğini veya yanlış görüntülendiğini belirtip kodu paylaştım)*

**Aldığım cevap:**
> Paylaştığın kodda arka planların üst üste binmesinin veya yanlış görünmesinin sebebi, her iki katmanın da (`bg1` ve `bg2`) aynı `canvas.width` boyutuyla çizilmesi ve çizim sırasıdır.
>
> ```javascript
> const bgUzak = { img: new Image(), x: 0, speed: 0.5 };
> const bgYakin = { img: new Image(), x: 0, speed: 1.5 };
>
> bgUzak.img.src = 'arkaplan.png';
> bgYakin.img.src = 'arkaplan2.png';
>
> function arkaPlaniGuncelle() {
>     bgUzak.x -= bgUzak.speed;
>     if (bgUzak.x <= -canvas.width) bgUzak.x = 0;
>     bgYakin.x -= bgYakin.speed;
>     if (bgYakin.x <= -canvas.width) bgYakin.x = 0;
> }
>
> function sahneyiCiz() {
>     context.clearRect(0, 0, canvas.width, canvas.height);
>     context.drawImage(bgUzak.img, bgUzak.x, 0, canvas.width, canvas.height);
>     context.drawImage(bgUzak.img, bgUzak.x + canvas.width, 0, canvas.width, canvas.height);
>     context.drawImage(bgYakin.img, bgYakin.x, 0, canvas.width, canvas.height);
>     context.drawImage(bgYakin.img, bgYakin.x + canvas.width, 0, canvas.width, canvas.height);
>     aktifEvler.forEach(ev => {
>         context.drawImage(ev.resim, ev.x, ev.y, ev.width, ev.height);
>     });
> }
> ```

**Ne yaptım:**
Bu öneriyi temel alarak arka plan sistemini düzelttim. Sonuçta iki ayrı arka plan nesnesi (`arkaplan1`, `arkaplan2`) kullandım ve sonsuz döngü mantığını kendim kurdum.

---

### 💬 Konuşma 7 — Ses Dosyası Ekleme

**Kullandığım araç:** Claude

**Benim promptum:**
> JavaScript oyunuma ses dosyası eklemek istiyorum. mp3 dosyasını nasıl yüklerim ve çalarım?

**Aldığım cevap:**
> `Audio` nesnesiyle ses dosyasını yükleyip çalabilirsin:
> ```javascript
> const ses = new Audio('dosya.mp3');
> ses.play();
> ```
> Aynı sesi üst üste çalmak istiyorsan `cloneNode()` kullan:
> ```javascript
> const s = ses.cloneNode();
> s.volume = 0.6;
> s.play();
> ```
> Döngüsel çalma için:
> ```javascript
> ses.loop = true;
> ses.play();
> ```

**Ne yaptım:**
`sesler` nesnesini kurdum. Ses seviyelerini, `playbackRate` değerlerini ve hangi olayda hangi sesin çalacağını kendim ayarladım.

---

### 💬 Konuşma 8 — addEventListener ve forEach

**Kullandığım araç:** Claude

**Benim promptum:**
> Klavye tuşlarını nasıl dinlerim? Tuşa basılınca ve bırakılınca farklı şeyler yapmak istiyorum. Ayrıca bir dizideki tüm elemanlara aynı işlemi nasıl uygularım?

**Aldığım cevap:**
> Klavye için `keydown` / `keyup`:
> ```javascript
> window.addEventListener('keydown', function(e) {
>     if (e.code === 'Space') { /* zıpla */ }
>     e.preventDefault();
> });
> window.addEventListener('keyup', function(e) {
>     if (e.code === 'ArrowDown') { /* eğilmeyi bırak */ }
> });
> ```
> Dizi döngüsü için `forEach`:
> ```javascript
> dizi.forEach(eleman => {
>     eleman.x -= hiz;
> });
> ```
> `forEach` içinde `return` yazarsan o eleman atlanır (continue gibi davranır).

**Ne yaptım:**
Zıplama, eğilme, menü başlatma ve oyun bitti kontrollerini bu yapıyla kurdum. `forEach`'i tüm düşman ve ev dizilerinde kullandım.

---

### 💬 Konuşma 9 — Bellek Yönetimi (Claude Kendisi Önerdi)

**Kullandığım araç:** Claude

**Nasıl ortaya çıktı:**
Ben sormadım. Claude koduma bakarken kendiliğinden öneri olarak söyledi. Ben de "olur" deyip uyguladım.

**Claude'un önerisi:**
> Koduna bakınca düşmanları diziye eklediğini görüyorum ama ekrandan çıkınca temizleme yok. Oyun uzadıkça bellekte yüzlerce ölü nesne birikir ve performans düşebilir. Her karede şöyle temizleyebilirsin:
> ```javascript
> dizi = dizi.filter(nesne => !nesne.oldu && nesne.x > -200);
> ```

**Ne yaptım:**
"Olur" deyip öneriyi kabul ettim ve tüm düşman dizilerine (karakasalar, rokular, kitsuneler, ates_topları, dusen_lambalar, bakeZorilar) uyguladım.

---

## Görseller ve Sesler

### Görseller
- **Panda animasyon kareleri:** ChatGPT ile üretildi, kullanılacak kareler benim tarafımdan seçildi.
- **Kitsune ateş topu:** ChatGPT ile üretildi.
- **Ev, düşman karakterler, arka planlar:** İnternette bulunan görseller Sticker uygulamasıyla işlenip arka planları temizlenerek `.png` formatına dönüştürüldü. Seçim tamamen bana aittir.

### Sesler
Tüm ses dosyaları ücretsiz (free-to-use) internet kaynaklarından indirilmiştir. Ses seçimi bana aittir, yapay zeka kullanılmamıştır.

---

## Sonuç

Yapay zekayı ağırlıklı olarak **görsel üretimi**, **JavaScript temellerini öğrenmek** ve **belirli fonksiyon içeriklerini yazdırmak** için kullandım. Oyunun fikri, düşman tasarımı ve mekanikler tamamen bana aittir. Bellek yönetimini ben sormadım — Claude koduma bakarken kendisi önerdi, ben de kabul ettim.
