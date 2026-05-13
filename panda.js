//önce canvası kuruyoruz tabii ki de

const canvas = document.getElementById('gameCanvas'); 
const context = canvas.getContext('2d');               

canvas.width  = 1200; 
canvas.height = 600;  

const yercekimi    = 0.75;  
const ziplamagucu  = -19;   
let   oyun_hiz     = 2.5;   
const ayak_hizasi = 95;    
const offset_cati   = 80;    
const maxcan       = 5;     
const yzemini       = 560;   // sadece referans olarak koydum


let canavar_hiz = 1.2; 


const ev_width      = 750; 
const ev_bitisik_mesafe = 450;              //genel olarak ayarlama kısımları
const ev_bosluk_genislik  = 400;  
const ev_grup_bosluk_sayi  = 5;    


let score             = 0;    
let level             = 0;    
let sonrakiLevelSkoru = 1000; 
let can               = 3;    
let olumsuzluk_suresi  = 0;    


let en_iyi_skor = localStorage.getItem('pandaEnYuksekSkor') ? parseInt(localStorage.getItem('pandaEnYuksekSkor')) : 0;                                                  


let kalkan_aktif  = false; 
let kalkansuresi = 0;    
const kalkan_verilen_sure = 300;  //burası 5sn yani kalkan 5sn surecek

let egilme_tusu_basili = false; 




const arkaplan1 = { img: new Image(), x: 0 };    
const arkaplan2 = { img: new Image(), x: 1200 }; 
arkaplan1.img.src = 'arkaplan.png';  
arkaplan2.img.src = 'arkaplan2.png'; 



const ev_resim      = ['ev9.png']; 
let   oyunbitti        = false;       
let   toplam_uretilen_ev = 0;           



let oyun_state = 'menu'; 





const sesler = {
    zipla    : new Audio('zıplama.mp3'),  
    oyun_bitis_sesi: new Audio('gameover.mp3'), 
    bonus    : new Audio('bonus.mp3'),    
    menu     : new Audio('menu.mp3'),     
    arkaplan : new Audio('arkaplan.mp3'), 
    punch    : new Audio('punch.mp3'),   
};

sesler.menu.loop     = true;  
sesler.menu.volume   = 0.7; 
sesler.arkaplan.loop = true;  
sesler.arkaplan.volume = 0.6; 


//ses dosyaalrının seçilip oynatıldığı bolum
function sesoynat(tip) {
    try {
        if (tip === 'zipla') {
            const s = sesler.zipla.cloneNode(); 
            s.volume = 0.6;                     
            s.play();                           
        } else if (tip === 'hasar') {
            const s = sesler.punch.cloneNode();
            s.volume = 0.7;
            s.play();
        } else if (tip === 'lamba') {
            const s = sesler.punch.cloneNode();
            s.volume = 0.5;
            s.play();
        } else if (tip === 'kalkan') {
            const s = sesler.bonus.cloneNode();
            s.volume = 0.7;
            s.playbackRate = 1.4; 
            s.play();
        } else if (tip === 'can') {
            const s = sesler.bonus.cloneNode();
            s.volume = 0.7;
            s.play();
        } else if (tip === 'dusmanYenildi') {
            const s = sesler.punch.cloneNode();
            s.volume = 0.8;
            s.playbackRate = 1.5; 
            s.play();
        } else if (tip === 'oyunBitti') {
            const s = sesler.oyun_bitis_sesi.cloneNode();
            s.volume = 0.9;
            s.play();
        }
    } catch(e) {
        
        console.warn('Ses oynatılamadı:', tip, e);
    }
}


let oyun_bitti_sesi_caldi = false;


// oyun müziğini durdur, sonra menü müziğini çal
function menuMuzigiBaslat() {
    sesler.arkaplan.pause();         
    sesler.arkaplan.currentTime = 0;  
    if (sesler.menu.paused) {         
        sesler.menu.currentTime = 0;
        sesler.menu.play().catch(e => {}); 
    }
}

// menu müziğini durdur ve başa sar
function menuMuzigiDurdur() {
    sesler.menu.pause();
    sesler.menu.currentTime = 0;
}


function arkaplanMuzigiBaslat() {
    sesler.arkaplan.currentTime = 0;
    sesler.arkaplan.play().catch(e => {}); 
}


function arkaplanMuzigiDurdur() {
    sesler.arkaplan.pause();
    sesler.arkaplan.currentTime = 0;
}


const yurume_animasyonu = []; 
['pandamm.png', 'yuruyenorta.png'].forEach(src => {
    const img = new Image();
    img.src = src;             
    yurume_animasyonu.push(img); 
});

const ziplam_animasyonu = []; 
['zıpla1.png', 'zıpla2.png', 'zıpla3.png'].forEach(src => {
    const img = new Image();
    img.src = src;
    ziplam_animasyonu.push(img);
});

let kac_kare_gecti = 0; 


let canavar_sayaci  = 0;   
const canavar_aralık = 560; 


// (0=Karakasa, 1=Rokurokubi, 2=Kitsune)
function rastgeleCanavar() {
    return Math.floor(Math.random() * 3); 
}





const zemin_secenekler = [20, 30, 40, 50, 60, 70, 80, 90]; // Farklı yükseklik seçenekleri.Burası çatı hizalama için gerekli


function rastgeleZeminSec() {
    return zemin_secenekler[Math.floor(Math.random() * zemin_secenekler.length)];
}


function canavarZeminHesapla(ev, canavar_height) {
    const offset = rastgeleZeminSec();             
    const cati_yuzeyi = ev.y + offset_cati + 90;      
    return cati_yuzeyi - canavar_height + offset;      
}


// BAKE-ZORİ 
const bakeZoriImg = new Image();
bakeZoriImg.src = 'bakezori.png'; 
let bakeZorilar   = [];           

let bakeZoriSayac   = 0;   
let bakeZoriSonraki = 400; 


function bakeZoriAralikHesapla() {
    const base = 400 + Math.floor(Math.random() * 400); 
    return Math.max(150, Math.floor(base / (1 + level * 0.15))); 
}


function yeniBakeZoriUret() {
    // Pandanın 200-700 piksel ilerisindeki evler
    const uygunevler = aktifevler.filter(ev =>
        ev.x > oyuncuPanda.x + 200 && ev.x < oyuncuPanda.x + 700
    );
    if (!uygunevler.length) return; 

    
    const ev = uygunevler[Math.floor(Math.random() * uygunevler.length)];
    const cati_y = ev.y + offset_cati + 90; // Seçilen evin çatı yüksekliği .Evlerin tam çatısına koyar bake zoriyi

    
    bakeZorilar.push({
        x: ev.x + 80 + Math.random() * (ev.width - 200), 
        y: cati_y - 35 + 90,  
        width: 85,            
        height: 90,           
        oldu: false           
    });
}


function bakeZoriGuncelle(pandaSol, pandaSag, pandaUst, pandaAlt) {
    if (!oyunbitti) {
        bakeZoriSayac++;
        if (bakeZoriSayac >= bakeZoriSonraki) {
            bakeZoriSayac   = 0;                          
            bakeZoriSonraki = bakeZoriAralikHesapla();   
            yeniBakeZoriUret();                          
        }
    }

    bakeZorilar.forEach(bakezori => {
        if (bakezori.oldu) return; 

        bakezori.x -= oyun_hiz; 

        
        if (pandaSag > bakezori.x + 4 && pandaSol < bakezori.x + bakezori.width - 4 &&
            pandaAlt > bakezori.y + 4 && pandaUst < bakezori.y + bakezori.height - 4 && olumsuzluk_suresi === 0) {
            if (kalkan_aktif) {
                
                kalkan_aktif = false;
                kalkansuresi = 0;
            } else {
              
                can--;
                olumsuzluk_suresi = 80; 
                sesoynat('hasar');
                if (can <= 0) oyunbitti = true; 
            }
            bakezori.oldu = true; 
        }

        if (bakezori.x < -80) bakezori.oldu = true; 
    });

    // Ölen bake-zorileri diziden temizle yoksa hafızada çok fazla birikir
    bakeZorilar = bakeZorilar.filter(bakezori => !bakezori.oldu);
}

// Bake-zorileri çizelim
function bakeZoriCiz(ctx) {
    bakeZorilar.forEach(bakezori => {
        if (bakezori.oldu) return;
        
        if (bakeZoriImg.complete && bakeZoriImg.naturalWidth > 0) {
            ctx.drawImage(bakeZoriImg, bakezori.x, bakezori.y, bakezori.width, bakezori.height);
        } 
    });
}



let dusen_lambalar   = []; 
let lamba_dusme_sayac = 0;   
const lamba_minaralik = 540; 
const lamba_maxaralik = 900; 

let lamba_dusme_sonraki = lamba_minaralik + Math.floor(Math.random() * (lamba_maxaralik - lamba_minaralik));


// Yeni bir düşen lamba üretme kısmı
function yeniLambaDus() {
    const x = 150 + Math.random() * (canvas.width - 300); 
    dusen_lambalar.push({
        x,
        y: -60,                               
        vy: 1.8 + Math.random() * 1.5,        
        boyut: 28 + Math.random() * 10,       
        oldu: false
    });
}


function lambaCiz(ctx, lamba) {
    ctx.save();
    ctx.font = `${lamba.boyut * 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏮', lamba.x, lamba.y); 
    ctx.restore();
}



const karakasaImg = new Image();
karakasaImg.src = 'dusman2.png'; 
let karakasalar   = [];           
                                                 //canavarların bileşenleri burası
const rokuImg = new Image();
rokuImg.src = 'dusman1.png'; 
let rokular   = [];           
const ROKU_YAPISMA_SURE = 180; 

const kitsuneImg  = new Image();
kitsuneImg.src = 'dusman3.png';   
const atesToplImg = new Image();
atesToplImg.src = 'atestopu.png'; 
let kitsuneler    = []; 
let ates_topları   = []; 




let oyuncuPanda = {
    x: 150,             
    y: 150,             
    width: 80,          
    height: 80,         //  buarsı da klasik panda ayarlamaları
    dikeyhiz: 0,        
    ziplama_sayisi: 0,   
    max_ziplama: 2      
};


function rastgeleHedefEv(min_mesafe) {
    const uygun_olan_evler = aktifevler.filter(ev =>
        ev.x > oyuncuPanda.x + min_mesafe && ev.x < canvas.width + 80
    );
    if (!uygun_olan_evler.length) return null;
    return uygun_olan_evler[Math.floor(Math.random() * uygun_olan_evler.length)];
}



function kalkanCiz(ctx, x, y) {
    ctx.save();
    const z = Date.now()/500;      
    const s = Math.sin(z)*4;      

    
    ctx.strokeStyle = '#00EEFF';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(0,200,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(x, y+s-14);
    ctx.lineTo(x+11, y+s-7);
    ctx.lineTo(x+11, y+s+4);
    ctx.lineTo(x, y+s+14);
    ctx.lineTo(x-11, y+s+4);
    ctx.lineTo(x-11, y+s-7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y+s-7); ctx.lineTo(x, y+s+7);   
    ctx.moveTo(x-6, y+s); ctx.lineTo(x+6, y+s);   
    ctx.stroke();
    ctx.restore();
}



//ve pandamızı koruyacak olan kalkan efekti kısmı
function pandaKalkanCiz(ctx, px, py, pandaH) {
    ctx.save();
    const z = Date.now()/300;
    const n = 1 + Math.sin(z)*0.08; 
    const cx = px+40;             
    const cy = py+pandaH/2;        
    const r  = (pandaH/2+6)*n;     

    
    const h = ctx.createRadialGradient(cx, cy, r-8, cx, cy, r+10);
    h.addColorStop(0, 'rgba(0,220,255,0.35)');
    h.addColorStop(1, 'rgba(0,100,255,0)');
    ctx.fillStyle = h;
    ctx.beginPath();
    ctx.arc(cx, cy, r+10, 0, Math.PI*2);
    ctx.fill();

   
}




function bambuCiz(ctx, x, y) {
    ctx.save();
    const z = Date.now()/400;
    const s = Math.sin(z)*6; 
    const iy = y+s;           

    

    
    const bW=10, bH=36, bx=x-bW/2, by=iy-bH/2;
    for(let i=0; i<3; i++) {
        const sh = bH/3; 
        ctx.fillStyle = i%2===0 ? '#66BB6A' : '#4CAF50'; 
        ctx.fillRect(bx, by+i*sh, bW, sh);
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by+i*sh, bW, sh);
    }

    // bambuya yaprak koyuyoruz doğal oyun akişina uygun olsun diye açıkçası
    ctx.fillStyle = '#81C784';
    ctx.beginPath();
    ctx.moveTo(bx, by+8);
    ctx.quadraticCurveTo(bx-18, by+2, bx-12, by+18); 
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bx+bW, by+18);
    ctx.quadraticCurveTo(bx+bW+18, by+12, bx+bW+10, by+28); 
    ctx.fill();

    
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 3;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText('+1 ❤️', x, iy-bH/2-8); 
    ctx.fillText('+1 ❤️', x, iy-bH/2-8);   
    ctx.textAlign = 'left';
    ctx.restore();
}




// zıplayan şemsiye hayaleti
function yeniKarakasaUret() {
    const ev = rastgeleHedefEv(320); 
    if (!ev) return null;            
    const H = 160;                   
    const z = canavarZeminHesapla(ev, H); 
    return {
        x: ev.x + ev.width + 80,    
        y: z,                        
        width: 160, height: 160,   // buralar klasik bilindik kısımlar
        zeminde: z,                  
        dikeyhiz: 0,                 
        yer_çekimii: 0.2,            
        ziplama_sayac: 0,            
        ziplam_aralik: 145 + Math.floor(Math.random()*100), 
        zipla_guc_min: -10, zip_guc_max: -15, 
        oldu: false,                  
        yenildi: false,              
        olum_anim_kare: 0            
    };
}

//  pandamıza yapışan boyunlu yaratık
function yeniRokuUret() {
    const ev = rastgeleHedefEv(400);
    if (!ev) return null;
    const H = 160;
    const z = canavarZeminHesapla(ev, H);
    return {
        x: ev.x + ev.width + 80,
        y: z,
        width: 160, height: H,
        zeminde: z,
        boynuz_animasyon: 0,         
        yapisiyor: false,            
        yapisma_kare_sure: 0,      
        oldu: false,
        olum_anim_kare: 0
    };
}

// kitsune ateş topu fırlatan canavarımızz
function yeniKitsuneUret() {
    const ev = rastgeleHedefEv(450);
    if (!ev) return null;
    const H = 160;
    const z = canavarZeminHesapla(ev, H);
    return {
        x: ev.x + ev.width + 80,
        y: z,
        width: 145, height: H-20,
        zeminde: z,
        kuyruk_animasyonu: Math.random()*Math.PI*2, 
        atis_sayac: 180 + Math.floor(Math.random()*80),
        oldu: false,
        olum_anim_kare: 0
    };
}


//burada ev üretiyoruz
function yeniEvUret(x_konum, bambu_olsun = true) {
    toplam_uretilen_ev++; 

    const rastgele_resim = ev_resim[Math.floor(Math.random() * ev_resim.length)];  //aslında başta iki adet koyacaktım ama koymadım böyle yapayım dedim
    const img = new Image();
    img.src = rastgele_resim;

    // %25 ihtimalle kalkan koy  çok fazla olamsınn
    const kalkan = Math.random() < 0.25 ? { x: 80 + Math.random()*280, y: -60 - Math.random()*80, alindi: false } : null; 

    // %30 ihtimalle bambu can koy . hemen bitebilir canlar çünküü  .
    const bambu_can = (bambu_olsun && Math.random() < 0.30)? { x: 80 + Math.random()*280, y: -55 - Math.random()*80, toplandi: false }: null;

   
    const bosluklu = (toplam_uretilen_ev % ev_grup_bosluk_sayi === 0);
   
    const sonraki_offset = ev_bitisik_mesafe + (bosluklu ? ev_bosluk_genislik : 0);

    return {
        x: x_konum+100, y: 100, 
        width: ev_width, height: 745, 
        resim: img,           
        kalkan, bambuCan: bambu_can,     
        bosluklu,             
        sonraki_offset: sonraki_offset       
    };
}



function oyunuSifirla() {
    
    score             = 0;
    level             = 0;
    sonrakiLevelSkoru = 1000;
    can               = 3;
    oyun_hiz         = 3;
    canavar_hız = 1.5;
    olumsuzluk_suresi  = 0;
    kalkan_aktif       = false;
    kalkansuresi      = 0;
    egilme_tusu_basili  = false;
    oyunbitti         = false;
    oyun_bitti_sesi_caldi = false;
    kac_kare_gecti          = 0;
    canavar_sayaci      = 0;

   
    karakasalar       = [];
    rokular           = [];
    kitsuneler        = [];
    ates_topları       = [];
    dusen_lambalar     = [];
    lamba_dusme_sayac   = 0;
    lamba_dusme_sonraki = lamba_minaralik + Math.floor(Math.random()*(lamba_maxaralik-lamba_minaralik));
    bakeZorilar       = [];
    bakeZoriSayac     = 0;
    bakeZoriSonraki   = 500; 

    toplam_uretilen_ev  = 0;
    aktifevler        = [];

   
    oyuncuPanda.x             = 150;
    oyuncuPanda.y             = 150;
    oyuncuPanda.dikeyhiz      = 0;
    oyuncuPanda.ziplama_sayisi = 0;

   
    arkaplan1.x = 0;
    arkaplan2.x = 1200;

   
    let x_baslangic= 0;
    for (let i = 0; i < 7; i++) {
        const ev = yeniEvUret(x_baslangic, i >= 2); 
        aktifevler.push(ev);
        x_baslangic += ev.sonraki_offset; 
    }
}


// MENÜ EKRANI ÇİZİMİ Kısmı

function menuCiz() {
    // Arkaplan resmini tüm ekrana yay
    context.drawImage(arkaplan1.img, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(0,0,0,0.58)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const zaman_ms = Date.now(); 
    const titreme = Math.sin(zaman_ms / 600) * 3; 

    // Başlık kutusu
    const kutuX = canvas.width/2 - 340;
    const kutuY = 80 + titreme; 
    const kutuW = 680, kutuH = 110;

    const basGrd = context.createLinearGradient(kutuX, kutuY, kutuX, kutuY+kutuH);
    basGrd.addColorStop(0, 'rgba(180,20,20,0.92)');  
    basGrd.addColorStop(1, 'rgba(100,0,0,0.92)');    
    context.fillStyle = basGrd;
    context.beginPath();
    context.roundRect(kutuX, kutuY, kutuW, kutuH, 16); 
    context.fill();
    context.strokeStyle = '#FFD700'; 
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(kutuX, kutuY, kutuW, kutuH, 16);
    context.stroke();

    // Oyun başlıği
    context.fillStyle   = '#FFD700';
    context.font        = 'bold 62px Arial';
    context.textAlign   = 'center';
    context.shadowColor = '#FF4400'; 
    context.shadowBlur  = 18;
    context.fillText('🐼 PANDA KOŞUSU 🏮', canvas.width/2, kutuY + 72);
    context.shadowBlur  = 0;

    
    context.fillStyle = 'rgba(255,220,180,0.88)';
    context.font      = '22px Arial';
    context.fillText("Japonya'nın çatılarında tehlikeli bir yolculuk!", canvas.width/2, 222);

    
    const bilgiY = 248;
    context.fillStyle = 'rgba(0,0,0,0.55)';
    context.beginPath();
    context.roundRect(canvas.width/2 - 310, bilgiY, 620, 168, 12);
    context.fill();
    context.strokeStyle = 'rgba(255,200,100,0.35)';
    context.lineWidth = 1.5;
    context.beginPath();
    context.roundRect(canvas.width/2 - 310, bilgiY, 620, 168, 12);
    context.stroke();

    context.fillStyle = '#FFF';
    context.font = 'bold 18px Arial';
    context.fillText('🎮 KONTROLLER', canvas.width/2, bilgiY + 28);
    context.font = '15px Arial';
    context.fillStyle = '#DDD';
    context.fillText('⬆ Yukarı Ok / Boşluk  →  Zıpla  (çift zıplama var!)', canvas.width/2, bilgiY + 52);
    context.fillText('⬇ Aşağı Ok / S  →  Eğil', canvas.width/2, bilgiY + 74);

    context.fillStyle = '#FFD700';
    context.font = 'bold 16px Arial';
    context.fillText('⚔️ DÜŞMANLAR', canvas.width/2, bilgiY + 100);
    context.font = '14px Arial';
    context.fillStyle = '#FFB8B8';
    context.fillText('👹 Karakasa — üstünden atla   🐙 Rokurokubi — dokunma, yapışır!   🦊 Kitsune — ateş topundan kaç', canvas.width/2, bilgiY + 122);
    context.fillStyle = '#B8FFB8';
    context.fillText('🛡️ Mavi kalkan topla   🎋 Bambu = +1 can   👡 Bake-zori üstünden atla', canvas.width/2, bilgiY + 146);

    
    if (en_iyi_skor > 0) {
        context.fillStyle = 'rgba(255,215,0,0.9)';
        context.font = 'bold 20px Arial';
        context.fillText(`🏆 En Yüksek Skor: ${en_iyi_skor}`, canvas.width/2, 432);
    }

    
    const buton_hareket = 1 + Math.sin(zaman_ms / 400) * 0.04; 
    const butonW    = 260 * buton_hareket; 
    const butonH    = 64  * buton_hareket;
    const butonX    = canvas.width/2 - butonW/2; 
    const butonY    = 452;

    const butonGrd = context.createLinearGradient(butonX, butonY, butonX, butonY+butonH);
    butonGrd.addColorStop(0, '#FF5500'); 
    butonGrd.addColorStop(1, '#CC2200'); 
    context.fillStyle = butonGrd;
    context.beginPath();
    context.roundRect(butonX, butonY, butonW, butonH, 14);
    context.fill();
    context.strokeStyle = '#FFD700';
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(butonX, butonY, butonW, butonH, 14);
    

    context.fillStyle   = '#070707';
    context.font        = 'bold 30px Arial';
    context.fillText('▶ OYUNU BAŞLAT', canvas.width/2, butonY + 42);
     


    const lY = Math.sin(zaman_ms / 700) * 6; 
    context.font = '42px Arial';
    context.fillText('🏮', 80,  120 + lY);
    context.fillText('🏮', canvas.width - 80, 120 + lY);
    context.fillText('🏮', 80,  540 - lY); 
    context.fillText('🏮', canvas.width - 80, 540 - lY);
     context.stroke();
    
    context.fillStyle = 'rgba(255, 103, 103, 0.6)';
    context.font      = '14px Arial';
    context.fillText('Tıkla veya ENTER ile başla', canvas.width/2, 560);

    context.textAlign = 'left'; 
}




function oyunuBaslat() {
    menuMuzigiDurdur();       
    arkaplanMuzigiBaslat();   
    oyunuSifirla();             
    oyun_state = 'oyun';      
}



function pandayiGuncelle() {

   
    oyuncuPanda.dikeyhiz += yercekimi;
    oyuncuPanda.y += oyuncuPanda.dikeyhiz;

   
    if (olumsuzluk_suresi > 0) olumsuzluk_suresi--;

    
    if (kalkan_aktif) {
        kalkansuresi--;
        if (kalkansuresi <= 0) {
            kalkan_aktif  = false;
            kalkansuresi = 0;
        }
    }

    
   
    const pandaH = egilme_tusu_basili ? 45 : 80;
    const pandaY = egilme_tusu_basili ? oyuncuPanda.y + (80 - pandaH) : oyuncuPanda.y;

    // "hitbox" denen şey bu
    const pandaSol = oyuncuPanda.x + 15;      
    const pandaSag = oyuncuPanda.x + 65;       
    const pandaUst = pandaY + 10;           
    const pandaAlt = pandaY + pandaH - 15;    

    // ev çatıları ile çarpışma 
    aktifevler.forEach(ev => {
        const cati_height = ev.y + offset_cati + 90; // Bu evin çatı yüzeyi Y konumu . +90 ekleim çünkü tam olarak sabitlemek istedim

       
        if (pandaSag > ev.x && pandaSol < ev.x + ev.width) {
                                                                    
            
            const ayak = oyuncuPanda.y + oyuncuPanda.height - ayak_hizasi;
            if (oyuncuPanda.dikeyhiz >= 0 && ayak >= cati_height && ayak <= cati_height + 32) {
                oyuncuPanda.y             = cati_height - (oyuncuPanda.height - ayak_hizasi); 
                oyuncuPanda.dikeyhiz      = 0; 
                oyuncuPanda.ziplama_sayisi = 0; 
            }

            // Kalkan toplama kontrolü
            if (ev.kalkan && !ev.kalkan.alindi) {
                const kalkanX = ev.x + ev.kalkan.x; 
                const kalkanY = cati_height + ev.kalkan.y;
                if (pandaSag>kalkanX-18 && pandaSol<kalkanX+18 && pandaAlt>kalkanY-18 && pandaUst<kalkanY+18) {
                    ev.kalkan.alindi = true;     
                    kalkan_aktif  = true;
                    kalkansuresi = kalkan_verilen_sure;  
                    sesoynat('kalkan');
                }
            }

           
            if (ev.bambuCan && !ev.bambuCan.toplandi) {
                const bX = ev.x + ev.bambuCan.x;
                const bY = cati_height + ev.bambuCan.y;
                if (pandaSag>bX-22 && pandaSol<bX+22 && pandaAlt>bY-30 && pandaUst<bY+30) {
                    ev.bambuCan.toplandi = true;
                    if (can < maxcan) {
                        can++;         
                        sesoynat('can');
                    } else {
                        score += 300;  
                         sesoynat('can');
                    }
                }
            }
        }
    });

   
    if (oyuncuPanda.y > canvas.height + 60) oyunbitti = true;

    // Bake-zorini
    bakeZoriGuncelle(pandaSol, pandaSag, pandaUst, pandaAlt);

    // geliş sistemi canavaralrın
    canavar_sayaci++;
    if (canavar_sayaci >= canavar_aralık && !oyunbitti) {
        canavar_sayaci = 0; 
        const tip = rastgeleCanavar(); // 0, 1 veya 2
        if      (tip === 0) { const k = yeniKarakasaUret(); if(k) karakasalar.push(k); }
        else if (tip === 1) { const r = yeniRokuUret();     if(r) rokular.push(r); }
        else if (tip === 2) { const f = yeniKitsuneUret();  if(f) kitsuneler.push(f); }

        // Bake-zori çok yakında gelecekse ertele  üst üste engel yığılmasın yoksa oyun oynanamıyor
        if (bakeZoriSonraki - bakeZoriSayac < 150) {
            bakeZoriSayac   = 0;
            bakeZoriSonraki = bakeZoriAralikHesapla();
        }
    }

    // ---- Karakasa güncelle ----
    karakasalar.forEach(karakasa => {
        if (karakasa.oldu) {
            karakasa.olum_anim_kare++; 
            return;
        }

        
        karakasa.dikeyhiz += karakasa.yer_çekimii;
        karakasa.y        += karakasa.dikeyhiz;

        
        if (karakasa.y >= karakasa.zeminde) {
            karakasa.y = karakasa.zeminde;
            karakasa.dikeyhiz = 0;
        }

        
        karakasa.ziplama_sayac++;
        if (karakasa.ziplama_sayac >= karakasa.ziplam_aralik && karakasa.y >= karakasa.zeminde - 2) {
            karakasa.ziplama_sayac = 0;
            const karakasa_hiz = 1 + level * 0.09; 
            karakasa.ziplam_aralik = Math.max(50, Math.floor((90 + Math.floor(Math.random()*80)) / karakasa_hiz));
            const karakasa_guc = 1 + level * 0.0267; 
            karakasa.dikeyhiz = (karakasa.zipla_guc_min + Math.random()*(karakasa.zip_guc_max - karakasa.zipla_guc_min)) * karakasa_guc;
        }

       
        karakasa.x -= oyun_hiz + canavar_hız;

        //karakasa çarpışma optime etme hile olmasınn
        const karakasa_sol=karakasa.x+18, karakasa_sag=karakasa.x+karakasa.width-18, kU=karakasa.y+25, kA=karakasa.y+karakasa.height-12;
        const panda_height=egilme_tusu_basili?45:80;
        const panda_y=egilme_tusu_basili?oyuncuPanda.y+(80-panda_height):oyuncuPanda.y;

        
        if (pandaSag>karakasa_sol && pandaSol<karakasa_sag && (panda_y+panda_height-10)>kU && (panda_y+5)<kA && olumsuzluk_suresi===0) {
            
            const ust = oyuncuPanda.dikeyhiz > 0 && (panda_y+panda_height-10) < kU+45;
            if (ust) {
               
                karakasa.oldu=true; karakasa.yenildi=true; score+=300;
                oyuncuPanda.dikeyhiz=-12; 
                oyuncuPanda.ziplama_sayisi=1; 
                sesoynat('dusmanYenildi');
            } else {
                
                if (kalkan_aktif) {
                    kalkan_aktif=false; kalkansuresi=0;
                    karakasa.oldu=true; 
                } else {
                    can--;
                    olumsuzluk_suresi=80;
                    karakasa.oldu=true;
                    sesoynat('hasar');
                    if(can<=0) oyunbitti=true;
                }
            }
        }
    });
    //bellek temizlendi
    karakasalar = karakasalar.filter(k => (!k.oldu || k.olum_anim_kare<30) && k.x>-220);

    // ---- Rokurokubi güncelle ----
    rokular.forEach(roku => {
        if (roku.oldu) {
            roku.olum_anim_kare++;
            return;
        }

        roku.boynuz_animasyon += 0.0478; 

        if (roku.yapisiyor) {
           
            roku.x = oyuncuPanda.x + 50; 
            roku.y = oyuncuPanda.y - 10;
            roku.yapisma_kare_sure--;     
            
            if (oyun_hiz > 0.8) oyun_hiz -= 0.0126;

           
            if (roku.yapisma_kare_sure <= 0) {
                roku.yapisiyor = false;
                roku.oldu = true;
                oyun_hiz = 1.9 + level * 0.2;
            }
        } else {
           
            roku.x -= oyun_hiz + canavar_hız;
            if (roku.y > roku.zeminde) roku.y = roku.zeminde; // Zeminin altına geçmesin
        }

        const roku_sol=roku.x+14, rSg=roku.x+roku.width-14, rU=roku.y+30, rA=roku.y+roku.height-12;
        const panda_height=egilme_tusu_basili?45:80;
        const panda_y=egilme_tusu_basili?oyuncuPanda.y+(80-panda_height):oyuncuPanda.y;

       
        if (pandaSag>roku_sol && pandaSol<rSg && (panda_y+panda_height-10)>rU && (panda_y+10)<rA && !roku.yapisiyor && olumsuzluk_suresi===0) {
            if (kalkan_aktif) {
                kalkan_aktif=false; kalkansuresi=0;
                roku.oldu=true; // Kalkan rokurokubiden de koruyor
            } else {
                roku.yapisiyor=true;              
                roku.yapisma_kare_sure=ROKU_YAPISMA_SURE; 
                sesoynat('hasar');
            }
        }
    });
    rokular = rokular.filter(r => (!r.oldu || r.olum_anim_kare<20) && r.x>-260);   //yine bellek temizliği

    // ---- Kitsune güncelle ----
    kitsuneler.forEach(kitsune => {
        if (kitsune.oldu) {
            kitsune.olum_anim_kare++;
            return;
        }

        kitsune.kuyruk_animasyonu += 0.06;                          
        kitsune.x -= oyun_hiz + canavar_hız;                       
        if (kitsune.y > kitsune.zeminde) kitsune.y = kitsune.zeminde; 

        
        kitsune.atis_sayac--;
        if (kitsune.atis_sayac <= 0) {
            const atis = 1 + level * 0.08; //level artarsa sende artt
            kitsune.atis_sayac = Math.max(80, Math.floor((180 + Math.floor(Math.random()*80)) / atis));

            
            const aH = egilme_tusu_basili?45:80;
            const aY = egilme_tusu_basili?oyuncuPanda.y+(80-aH):oyuncuPanda.y;

            
            const tx = oyuncuPanda.x+40 - (kitsune.x+kitsune.width/2); 
            const ty = (aY+aH/2) - (kitsune.y+kitsune.height/2);       
            const uz = Math.sqrt(tx*tx+ty*ty);                 

            const topHiz = 6.5 + level * 0.3812; 
            ates_topları.push({
                x: kitsune.x, y: kitsune.y+kitsune.height/2,
                vx: (tx/uz)*topHiz, 
                vy: (ty/uz)*topHiz, 
                faz: 0,              
                oldu: false
            });
        }

        // Kitsune ile çarpışm kismiiii
        const kS=kitsune.x+18, kSg=kitsune.x+kitsune.width-18, kU=kitsune.y+22, kA=kitsune.y+kitsune.height-12;
        const panda_height=egilme_tusu_basili?45:80;
        const panda_y=egilme_tusu_basili?oyuncuPanda.y+(80-panda_height):oyuncuPanda.y;
        if (pandaSag>kS && pandaSol<kSg && (panda_y+panda_height-10)>kU && (panda_y+10)<kA && olumsuzluk_suresi===0) {
            if (kalkan_aktif) {
                kalkan_aktif=false; kalkansuresi=0;
                kitsune.oldu=true;
            } else {
                can--; olumsuzluk_suresi=80; kitsune.oldu=true;
                sesoynat('hasar');
                if(can<=0) oyunbitti=true;
            }
        }
    });
    kitsuneler = kitsuneler.filter(kf => (!kf.oldu || kf.olum_anim_kare<25) && kf.x>-220);  //yine bellek temizliği

    // ateş toplarını güncelleme kısmı
    ates_topları.forEach(at => {
        if (at.oldu) return;
        at.x += at.vx;      
        at.y += at.vy;      
        at.faz += 0.2745;      

        const aH=egilme_tusu_basili?45:80;
        const aY=egilme_tusu_basili?oyuncuPanda.y+(80-aH):oyuncuPanda.y;

        // Pandamızz ile çarpışma kısmı ayarlanmsı
        if (at.x+16>oyuncuPanda.x+15 && at.x-16<oyuncuPanda.x+65 &&
            at.y+16>aY+10 && at.y-16<aY+aH-10 && olumsuzluk_suresi===0) {
            at.oldu = true;
            if (kalkan_aktif) {
                kalkan_aktif=false; kalkansuresi=0; 
            } else {
                can--; olumsuzluk_suresi=80; sesoynat('hasar');
                if(can<=0) oyunbitti=true;
            }
        }

        
        if (at.x<-70||at.x>canvas.width+70||at.y<-70||at.y>canvas.height+70) at.oldu=true;
    });
    ates_topları = ates_topları.filter(a => !a.oldu);

   
    lamba_dusme_sayac++;
    if (lamba_dusme_sayac >= lamba_dusme_sonraki && !oyunbitti) {
        lamba_dusme_sayac = 0;
        lamba_dusme_sonraki = lamba_minaralik + Math.floor(Math.random()*(lamba_maxaralik-lamba_minaralik));
        yeniLambaDus();
    }
    dusen_lambalar.forEach(t => {
        if (t.oldu) return;
        t.y  += t.vy;        // Aşağı düş
        t.vy += 0.06;        
        t.x  -= oyun_hiz; 

        const tS=t.x-t.boyut, tSg=t.x+t.boyut, tU=t.y-t.boyut, tA=t.y+t.boyut;
        if (pandaSag>tS && pandaSol<tSg && pandaAlt>tU && pandaUst<tA && olumsuzluk_suresi===0) {
            t.oldu = true;
            sesoynat('lamba');
            if (kalkan_aktif) {
                kalkan_aktif=false; kalkansuresi=0;
            } else {
                can--; olumsuzluk_suresi=80; sesoynat('hasar');
                if(can<=0) oyunbitti=true;
            }
        }

        
        if (t.y > canvas.height+80 || t.x < -100) t.oldu = true;
    });
    dusen_lambalar = dusen_lambalar.filter(t => !t.oldu);

    
    if (!oyunbitti) {
        score += 1; 
        if (score >= sonrakiLevelSkoru) {
            level++;                       
            oyun_hiz += 0.2;             
            canavar_hız += 0.15; 
            sonrakiLevelSkoru += 1000;    
        }
    }
    if (oyunbitti && !oyun_bitti_sesi_caldi) {
        oyun_bitti_sesi_caldi = true;
        sesoynat('oyunBitti');
        arkaplanMuzigiDurdur();

        
        if (score > en_iyi_skor) {
            en_iyi_skor = score;
            localStorage.setItem('pandaEnYuksekSkor', en_iyi_skor);
        }
    }
}


//vee sahne çizimi
function sahneyiCiz() {
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    
    context.drawImage(arkaplan1.img, arkaplan1.x, 0, canvas.width, canvas.height);
    context.drawImage(arkaplan2.img, arkaplan2.x, 0, canvas.width, canvas.height);

    

   
    aktifevler.forEach(ev => {
        const catiY = ev.y + offset_cati;
        if (ev.kalkan && !ev.kalkan.alindi) kalkanCiz(context, ev.x+ev.kalkan.x, catiY+ev.kalkan.y);
        if (ev.bambuCan && !ev.bambuCan.toplandi) bambuCiz(context, ev.x+ev.bambuCan.x, catiY+ev.bambuCan.y);
        context.drawImage(ev.resim, ev.x, ev.y, ev.width, ev.height); // Evi üstüne çiz
    });

    // Bake-zorini çiz
    bakeZoriCiz(context);

    // Düşen lambalarrr
    dusen_lambalar.forEach(t => {
        if (t.oldu) return;
        lambaCiz(context, t);
    });

    // karakasalar
    karakasalar.forEach(k => {
       
        if (k.oldu && k.yenildi) {
            context.save();
            context.fillStyle = '#FFD700';
            context.font = `bold ${26+k.olum_anim_kare}px Arial`; 
            context.textAlign = 'center';
            context.fillText('+300', k.x+k.width/2, k.y - k.olum_anim_kare*2); 
            context.textAlign = 'left';
            context.restore();
            return;
        }
        if (k.oldu) return;

        if (karakasaImg.complete && karakasaImg.naturalWidth > 0) {
            context.drawImage(karakasaImg, k.x, k.y, k.width, k.height);
        }

        context.save();
        context.font = 'bold 13px Arial';
        context.textAlign = 'center';
        context.fillStyle = k.y < k.zeminde-30 ? 'rgba(255,220,50,0.95)' : 'rgba(255,80,80,0.92)';
        context.fillText(k.y < k.zeminde-30 ? '↓ ÜSTİNDEN ATLA!' : '^| EĞİL!', k.x+k.width/2, k.y-10);
        context.textAlign = 'left';
        context.restore();
    });

    //rokurokubiler
    rokular.forEach(r => {
        if (r.oldu) return;
        context.save();
        const tit = r.yapisiyor ? (Math.random()-0.5)*3 : 0; //yine hafif bir titreşim
        if (r.yapisiyor) {
           
            const panda_height=egilme_tusu_basili?45:80;
            const panda_Y=egilme_tusu_basili?oyuncuPanda.y+(80-panda_height):oyuncuPanda.y;
            const gX=oyuncuPanda.x+55+tit, gY=panda_Y;
            if (rokuImg.complete && rokuImg.naturalWidth > 0) {
                context.drawImage(rokuImg, gX, gY, r.width, r.height);
            }

            const yuzde=r.yapisma_kare_sure/ROKU_YAPISMA_SURE; // 0-1 arası doluluk oranı
            const barX=oyuncuPanda.x, barY=panda_Y-24;
            context.fillStyle='rgba(0,0,0,0.55)';
            context.fillRect(barX, barY, 80, 9);       
            context.fillStyle=`rgba(255,${Math.floor(200*yuzde)},0,0.95)`; 
            context.fillRect(barX, barY, 80*yuzde, 9); 
            
           
        } else {
           
            if (rokuImg.complete && rokuImg.naturalWidth > 0) {
                context.drawImage(rokuImg, r.x, r.y, r.width, r.height);
            }
        }
        context.restore();
    });

    //o mavi ateş topu kısmı buarsı
    ates_topları.forEach(at => {
        context.save();
       
        const g=context.createRadialGradient(at.x, at.y, 2, at.x, at.y, 24);
        g.addColorStop(0,   'rgba(255,255,180,1)');
        g.addColorStop(0.3, 'rgba(255,140,0,0.9)');
        g.addColorStop(0.7, 'rgba(255,50,0,0.6)');
        g.addColorStop(1,   'rgba(255,0,0,0)');
        context.fillStyle=g;
        context.beginPath();
        context.arc(at.x, at.y, 24, 0, Math.PI*2);
        context.fill();
        // Üstüne ateş topu spritesi çiz
        if(atesToplImg.complete && atesToplImg.naturalWidth>0)
            context.drawImage(atesToplImg, at.x-18, at.y-18, 36, 36);
        context.restore();
    });

    // ---- Kitsuneleri çiz ----
    kitsuneler.forEach(kf => {
        if (kf.oldu) {
           
            context.save();
            context.globalAlpha = 1 - kf.olum_anim_kare/25;
            context.font = `bold ${22+kf.olum_anim_kare}px Arial`;
            context.textAlign='center';
            context.fillText('💥', kf.x+kf.width/2, kf.y - kf.olum_anim_kare*2);
            context.textAlign='left';
            context.restore();
            return;
        }
        context.save();
        const km = kf.x+kf.width/2;  
        const ka = kf.y+kf.height;    

        //matsin kısmı aşağı yukarı vs dalgalanmalar için koydum kısacası
        for(let i=0; i<9; i++) {
            const ba = -Math.PI/2+(i-4)*(Math.PI/10); 
            const sa = ba + Math.sin(kf.kuyruk_animasyonu + i*0.4)*0.28; 
            const ku = 70 + Math.sin(kf.kuyruk_animasyonu*0.7 + i)*12; 

            
            const kx1=km+Math.cos(sa+Math.PI)*16, ky1=ka-38;
            const kx2=km+Math.cos(sa+Math.PI)*ku, ky2=ka-38+Math.sin(sa+Math.PI)*ku;

            
            const kg=context.createLinearGradient(kx1, ky1, kx2, ky2);
            kg.addColorStop(0,   'rgba(255,160,30,0.9)');
            kg.addColorStop(0.6, 'rgba(255,100,0,0.6)');
            kg.addColorStop(1,   'rgba(255,220,100,0)');
            context.strokeStyle=kg;
            context.lineWidth = 9 - Math.abs(i-4)*0.7; // Ortadaki kuyruk daha kalın
            context.lineCap='round';
            context.beginPath();
            context.moveTo(kx1, ky1);
            
            context.quadraticCurveTo(
                km+Math.cos(sa+Math.PI)*ku*0.5+Math.sin(kf.kuyruk_animasyonu+i)*15,
                ky1+(ky2-ky1)*0.5,
                kx2, ky2
            );
            context.stroke();
        }

        
        if(kitsuneImg.complete && kitsuneImg.naturalWidth > 0) {
            context.drawImage(kitsuneImg, kf.x, kf.y, kf.width, kf.height);
        }
        context.restore();
    });

    // pandayı çiz
    const pandaHeight = egilme_tusu_basili ? 45 : 80; 
    const pandaY = egilme_tusu_basili ? oyuncuPanda.y + (80 - pandaHeight) : oyuncuPanda.y;

    
    if (olumsuzluk_suresi % 12 < 6) {
        let animasyon;
        if (oyuncuPanda.ziplama_sayisi > 0) {
            
            animasyon = ziplam_animasyonu[Math.min(Math.floor((kac_kare_gecti%18)/15), 2)];
        } else {
            
            animasyon = yurume_animasyonu[Math.floor(kac_kare_gecti/30)%2];
        }
        if (animasyon && animasyon.complete) context.drawImage(animasyon, oyuncuPanda.x, pandaY, 80, pandaHeight);
    }

   
    if (kalkan_aktif) pandaKalkanCiz(context, oyuncuPanda.x, pandaY, pandaHeight);

    // koşedeki panel için
    const bilgi_panel_x = canvas.width - 235; // Sağ üst köşe
    const bilgi_panel_y = kalkan_aktif ? 140 : 108; // Kalkan varsa panel biraz uzuyor
    context.fillStyle='rgba(0,0,0,0.72)';
    context.fillRect(bilgi_panel_x, 15, 220, bilgi_panel_y); // Yarı saydam siyah arka plan

    context.fillStyle='white';
    context.font='bold 20px Arial';
    context.fillText(`Skor: ${score}`,   bilgi_panel_x+15, 45);
    context.fillText(`Seviye: ${level}`, bilgi_panel_x+15, 75);

   
    context.fillStyle = can===1 ? '#FF3333' : '#00FF00'; // 1 can kaldıysa kırmızı uyarı
    context.font='bold 18px Arial';
    context.fillText('🐼'.repeat(can) + '🖤'.repeat(maxcan-can), bilgi_panel_x+15, 102);

    
    if (en_iyi_skor > 0) {
        context.fillStyle='rgba(255,215,0,0.85)';
        context.font='12px Arial';
        context.fillText(`🏆 En İyi: ${en_iyi_skor}`, bilgi_panel_x+15, bilgi_panel_y+14);
    }

    
    if (kalkan_aktif) {
        const y2 = kalkansuresi/kalkan_verilen_sure; // 0-1 arası doluluk oranı
        context.fillStyle='rgba(0,200,255,0.9)';
        context.font='bold 18px Arial';
        context.fillText(`🛡️ ${Math.ceil(kalkansuresi/60)}s`, bilgi_panel_x+15, 128); 
        context.fillStyle='rgba(0,0,0,0.5)';
        context.fillRect(bilgi_panel_x+15, 132, 190, 8);          
        context.fillStyle='#00EEFF';
        context.fillRect(bilgi_panel_x+15, 132, 190*y2, 8);       
    }

    // oyun bitti ekranı 
    if (oyunbitti) {
        // Tüm ekranı karart
        context.fillStyle='rgba(0,0,0,0.87)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle='white';
        context.font='bold 60px Arial';
        context.textAlign='center';
        context.fillText('OYUN BİTTİ!', canvas.width/2, canvas.height/2-40);

        context.font='30px Arial';
        context.fillText(`Skor: ${score}`, canvas.width/2, canvas.height/2+10);

        // Rekor kırıldı mı
        if (score >= en_iyi_skor) {
            context.fillStyle='#FFD700';
            context.font='bold 26px Arial';
            context.fillText('🏆 YENİ REKOR!', canvas.width/2, canvas.height/2+50);
        } else {
            context.fillStyle='rgba(255,215,0,0.7)';
            context.font='22px Arial';
            context.fillText(`En İyi Skor: ${en_iyi_skor}`, canvas.width/2, canvas.height/2+50);
        }

        context.fillStyle='white';
        context.font='24px Arial';
        context.fillText('Menüye dönmek için tıkla', canvas.width/2, canvas.height/2+92);
        context.textAlign='left';
    }
}


// ANA OYUN DÖNGÜSÜ

function oyunDongusu() {
    if (oyun_state === 'menu') {
        // Menüdeyken müzik çalmaya başlayabilir mi kontrol et
        
        if (sesler.menu.paused) {
            sesler.menu.play().catch(() => {});
        }
        menuCiz(); // Menü ekranını çiz

    } else if (oyun_state === 'oyun') {
        if (!oyunbitti) {
            // Arkaplanı sola kaydır 
            arkaplan1.x -= oyun_hiz * 0.4;
            arkaplan2.x -= oyun_hiz * 0.4;

            // Arkaplan ekranın solundan tamamen çıktıysa diğerinin arkasına geçir
            // Bu "sonsuz döngü" efekti yaratırmak içinn
            if (arkaplan1.x <= -canvas.width) arkaplan1.x = canvas.width;
            if (arkaplan2.x <= -canvas.width) arkaplan2.x = canvas.width;

            // Tüm evleri oyun hızıyla sola kaydır
            aktifevler.forEach(ev => ev.x -= oyun_hiz);

            
            if (aktifevler[0].x + aktifevler[0].width < 0) {
                const son = aktifevler[aktifevler.length - 1]; 
                aktifevler.shift();                           
                aktifevler.push(yeniEvUret(son.x + son.sonraki_offset, true)); 
            }

            kac_kare_gecti++;           
            pandayiGuncelle();    
        }
        sahneyiCiz(); 
    }

    requestAnimationFrame(oyunDongusu); 
}

yurume_animasyonu[0].onload = () => {
    oyunDongusu(); // oyun başlamı kısmı diyebiliriz burası olamdan olmazzz
}

// buaralar tamamen klavye fare kontrol vs 

window.addEventListener('keydown', e => {

    
    if (oyun_state === 'menu' && (e.code === 'Enter' || e.code === 'Space')) {
        sesler.menu.play().catch(() => {}); 
        setTimeout(() => oyunuBaslat(), 83); 
        e.preventDefault(); 
        return;
    }

   
    if (oyun_state === 'oyun' && (e.code === 'Space' || e.code === 'ArrowUp')) {
        
        if (oyuncuPanda.ziplama_sayisi < oyuncuPanda.max_ziplama && !oyunbitti) {
            oyuncuPanda.dikeyhiz     = ziplamagucu; 
            oyuncuPanda.ziplama_sayisi++;              
            kac_kare_gecti = 0;                            
            sesoynat('zipla');
        }
        e.preventDefault(); 
    }

    
    if (oyun_state === 'oyun' && (e.code === 'ArrowDown' || e.code === 'KeyS')) {
        egilme_tusu_basili = true; 
        e.preventDefault();
    }
});


window.addEventListener('keyup', e => {
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        egilme_tusu_basili = false; 
    }
});


canvas.addEventListener('mousedown', () => {
    if (oyun_state === 'menu') {
        
        sesler.menu.play().catch(() => {});
        setTimeout(() => oyunuBaslat(), 80);
    } else if (oyun_state === 'oyun' && oyunbitti) {
        oyun_state = 'menu';
        arkaplanMuzigiDurdur();
        menuMuzigiBaslat();
    }
});


// menü için ilk müzik başlatma kısmı

function ilkEtkilesimMuzik() {
    if (oyun_state === 'menu') {
        sesler.menu.currentTime = 0;
        sesler.menu.play().catch(() => {});  
    }
}
window.addEventListener('mousedown',  ilkEtkilesimMuzik, { once: true }); 
window.addEventListener('keydown',    ilkEtkilesimMuzik, { once: true });
