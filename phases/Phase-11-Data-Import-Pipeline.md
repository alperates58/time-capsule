# Phase 11 — Data Import Pipeline

## Goal
JSON import, validation, duplicate kontrol, review queue.

## Expected Output
Veri sisteme kontrollü girer.

## Rules
- İlgili dokümanları okumadan uygulama yapılmaz.
- Her değişiklik deploy edilebilir durumda bırakılır.
- Gereksiz overengineering yapılmaz.
- SEO, performans ve erişilebilirlik her phase içinde düşünülür.

## Tasks
1. Mevcut repo durumunu incele.
2. Bu phase için uygulanacak dosya ve klasörleri belirle.
3. Küçük, güvenli adımlarla uygula.
4. Test et.
5. Değişiklik özetini yaz.

## Acceptance Criteria
- Proje localde çalışır.
- Hata yoktur.
- TypeScript/lint hatası yoktur.
- Docker/Coolify akışı bozulmaz.
- Kullanıcıya net rapor verilir.

## Do Not
- Bir sonraki phase'e atlama.
- Kapsam dışı büyük refactor yapma.
- Kaynaksız veri ekleme.
