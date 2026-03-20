# 🎨 Online Whiteboard (Local-First Drawing App)

🚀 **Canlı Demo:** [https://onlinewhiteboardapp.netlify.app]

## 📌 Proje Hakkında
Bu proje, kullanıcıların herhangi bir hesap oluşturmadan ve verilerini üçüncü parti sunucularla paylaşmadan anında çizim yapabildiği, **"Local-First" (Önce Yerel)** mimariye sahip bir dijital beyaz tahta (whiteboard) uygulamasıdır. 

Sıradan bir CRUD uygulamasının ötesine geçerek tamamen **İstemci Taraflı (Client-Side)** çalışacak şekilde tasarlanmıştır. Bu sayede **sıfır sunucu maliyeti (Zero-Cost Architecture)** ile sınırsız ölçeklenebilirlik ve %100 veri gizliliği sunar.

## ✨ Öne Çıkan Özellikler (Mühendislik Yaklaşımı)

* **🎨 Gelişmiş Çizim Motoru (HTML5 Canvas):** Standart DOM manipülasyonu yerine HTML5 `<canvas>` API kullanılarak yüksek performanslı vektörel çizim ve şekil oluşturma.
* **🧠 İleri Seviye State Yönetimi (Undo/Redo):** "Memento Design Pattern" ilham alınarak kurulan özel yığın (stack) mimarisi sayesinde kusursuz Geri Al / İleri Al özellikleri.
* **🗄️ Kalıcı Yerel Depolama (IndexedDB):** Kullanıcı sekmeyi kapatsa dahi çizimler kaybolmaz. LocalStorage'ın kapasite sınırlarını aşmak için asenkron yapıdaki IndexedDB kullanılmıştır.
* **📄 Client-Side PDF Çıktısı (Export):** Çizimler, hiçbir sunucuya (backend) gönderilmeden, doğrudan kullanıcının tarayıcısında anlık olarak yüksek çözünürlüklü PDF formatına dönüştürülüp indirilebilir.

## 🛠️ Kullanılan Teknolojiler
* **Frontend:** React, TypeScript, Vite
* **Stilleme:** Tailwind CSS
* **Çizim:** Native HTML5 Canvas API
* **Veritabanı:** IndexedDB (Sunucusuz yerel kayıt)
* **Araçlar:** jsPDF (Client-side PDF üretimi)
* **Hosting:** Netlify
