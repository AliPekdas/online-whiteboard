# Product Requirements Document (PRD) 
**Proje Adı:** Online Whiteboard
**Tarih:** 20 Mart 2026
**Hazırlayan:** Ali Doğan Pekdaş

---

## 1. Proje Özeti
Bu proje, kullanıcıların herhangi bir üyelik oluşturmadan ve sunucuya veri göndermeden anında çizim yapabildiği, şemalar oluşturabildiği **"Local-First"** ve gizlilik odaklı bir dijital beyaz tahta (whiteboard) uygulamasıdır. Klasik CRUD uygulamalarının aksine %100 istemci taraflı (client-side) çalışarak sıfır sunucu maliyetiyle sınırsız ölçeklenebilirlik sunar.

## 2. Problem ve Çözüm

* **Problem:** Geleneksel çizim ve zihin haritası araçları (Miro, Lucidchart vb.) kullanıcıdan hesap açmasını ister, verileri uzak sunucularda tutarak gizlilik endişesi yaratır ve sürekli internet bağlantısı gerektirir.
* **Çözüm:** Kullanıcının cihazının işlem gücünü kullanan, verileri sadece yerel tarayıcıda (IndexedDB) saklayan ve anında açılıp kullanılabilen, sunucusuz (backend-less) bir vektörel çizim aracı.

## 3. Hedef Kitle
* Hızlıca şema veya akış diyagramı çizmek isteyen yazılımcılar ve öğrenciler.
* Verilerinin (özellikle şirket içi mimari çizimlerin) üçüncü parti sunuculara gitmesini istemeyen profesyoneller.
* Toplantı anında hızlıca görsel not almak isteyen girişimciler ve tasarımcılar.

## 4. Temel Özellikler (MVP Kapsamı)
Aşağıdaki özellikler uygulamanın ilk sürümünde yer alacaktır:

* **HTML5 Canvas Tabanlı Çizim Motoru:** Serbest çizim (kalem), dikdörtgen, elips ve ok/çizgi oluşturma araçları. Ekrana çizilen her öğe bir piksel yığını değil, matematiksel bir vektör objesi olarak yönetilecektir.
* **Gelişmiş State Yönetimi (Geri Al / İleri Al):** Kullanıcının yaptığı her hamle, "Memento Pattern" (Hatıra Tasarım Deseni) mimarisiyle özel bir yığın (stack) hafızasında tutulacak, böylece sınırsız undo/redo imkanı sağlanacaktır.
* **Client-Side PDF Dışa Aktarma:** Çizilen şemalar, hiçbir sunucuya yüklenmeden kullanıcının tarayıcısında anlık olarak (`jsPDF` kullanılarak) yüksek çözünürlüklü PDF formatına dönüştürülüp indirilebilecektir.
* **Kalıcı Yerel Depolama:** Kullanıcı sekmeyi veya tarayıcıyı kapatsa bile, tüm vektörel çizim verileri tarayıcının yerel veritabanına (`IndexedDB`) asenkron olarak kaydedilecek ve siteye tekrar girildiğinde veri kaybı yaşanmayacaktır.

## 5. Teknik Mimari
* **Frontend Arayüzü:** React (veya Vanilla JS) + Tailwind CSS (Hızlı ve modern bir UI için).
* **Çizim ve Render:** Native HTML5 `<canvas>` API.
* **Yerel Veritabanı:** IndexedDB (Localstorage'ın 5MB sınırını aşmak ve asenkron veri yazmak için).
* **PDF Motoru:** `jsPDF` kütüphanesi.
* **Hosting / Dağıtım:** Netlify (Statik dosya barındırma, sıfır sunucu (backend) ihtiyacı, global CDN ile ışık hızında açılış).

## 6. Kullanıcı Akışı (User Flow)
1. Kullanıcı Netlify linkine tıklar. *(Uygulama 1 saniyenin altında yüklenir çünkü backend bekleme süresi yoktur).*
2. Ekranda boş bir tuval ve sol/üst tarafta araç çubuğu (toolbar) belirir.
3. Kullanıcı şekiller çizer, metinler ekler. *(Her hamle anlık olarak IndexedDB'ye yedeklenir).*
4. Kullanıcı hatalı çizimi "Geri Al" (Ctrl+Z) ile düzeltir.
5. İşlem bitince **"PDF Olarak İndir"** butonuna tıklar. Tarayıcı mili-saniyeler içinde PDF'i üretip cihazın "İndirilenler" klasörüne kaydeder.
