# Docker Strategy

Next.js için multi-stage Dockerfile önerilir.

## Kurallar
- Production dependency minimal olmalı
- Build cache kullanılmalı
- PORT env desteklenmeli
- Healthcheck endpoint bulunmalı
