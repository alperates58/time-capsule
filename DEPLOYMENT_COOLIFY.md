# Coolify Dağıtım (Deployment) Kurulumu

Bu doküman, TimeCapsule Phase 1 temelinin Coolify sunucunuza dağıtılması için gereken kesin adımları ve yapılandırmaları içermektedir.

## 1. Uygulama Kurulumu (App Setup)
- **Uygulama Türü (App Type)**: Public Git Repository (eğer reponuz herkese açıksa) veya Private Git Repository (GitHub App / Deploy Key kullanarak).
- **Domain**: `https://timecapsule.alperates.com.tr` (Cloudflare DNS ayarlarınızın Coolify Ubuntu sunucunuzu işaret ettiğinden emin olun).
- **Derleme Yöntemi (Build Method)**: Dockerfile
- **Yeniden Dağıtım (Redeploy Behavior)**: "Auto Deploy" seçeneğini aktif edin. Böylece main branch'e yapılan her push işlemi otomatik olarak yeni bir Coolify derlemesini ve dağıtımını tetikler.

## 2. Derleme Yapılandırması (Build Configuration)
- **Dockerfile Kullanımı**: Coolify, deponun kök dizinindeki `Dockerfile` dosyasını otomatik olarak algılayacaktır. Bu Dockerfile dosyası, Next.js `standalone` modu ve çok aşamalı (multi-stage) derleme kullanılarak en üst düzeyde optimize edilmiştir.
- **Port**: `3000` (Bu, Dockerfile içindeki EXPOSE direktifi ile eşleşir).
- **Başlatma Komutu (Start Command)**: `node server.js` (`standalone` modu `npm start` kullanmaz, doğrudan build edilen sunucuyu çalıştırır).

## 3. Çevre Değişkenleri (Environment Variables)
Coolify arayüzündeki uygulamanızın "Environment Variables" sekmesinde aşağıdaki değişkenleri ayarlamanız gerekmektedir:
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://<kullanici_adi>:<sifre>@<postgres_host_adresi>:5432/timecapsule?schema=public`

*(Gerçek `.env` dosyanızı kesinlikle repoya commit etmeyin. Yalnızca `.env.example` dosyası takip edilmelidir).*

## 4. PostgreSQL Servis Önerisi
Prisma kullandığımız için bir PostgreSQL veritabanına ihtiyacınız var.
- **Kurulum**: Coolify üzerinde yeni bir **PostgreSQL** servisi kurun (Sürüm 15+ önerilir).
- **Ağ İletişimi**: Hem uygulamanız hem de veritabanınız Coolify üzerinde olduğundan, onları dahili ağ üzerinden bağlayabilirsiniz. `DATABASE_URL` değişkeninizde Coolify'ın DB için sağladığı dahili hostname'i (internal hostname) kullanın.
- **İlk Kurulum**: Prisma şemamız şu an için boş. Phase 1'de derleme aşamasında sadece `prisma generate` komutu çalışır ve bu tamamen güvenlidir. İlerleyen fazlarda, veritabanı şemasını oluşturmak için Coolify üzerinden dağıtım öncesi (pre-deploy) veya dağıtım sonrası (post-deploy) komut olarak `prisma db push` veya `prisma migrate deploy` komutlarını çalıştırmanız gerekecektir.
