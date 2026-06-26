# Technical Architecture

Bu doküman TimeCapsule Project Bible v2 içinde yer alır. Amaç, Antigravity/Gemini/Codex gibi AI araçlarının projeyi tutarlı şekilde geliştirmesini sağlamaktır.

## Önerilen Stack
- Frontend: Next.js App Router
- Dil: TypeScript
- UI: Tailwind CSS + shadcn/ui
- DB: PostgreSQL
- ORM: Prisma
- Search: İlk aşama PostgreSQL full-text + trigram; sonra Meilisearch/Typesense
- Deploy: Docker + Coolify
- CDN/DNS: Cloudflare

## Neden Next.js?
Programmatic SEO, SSG/ISR, metadata yönetimi, statik yıl sayfaları ve hızlı kullanıcı deneyimi için uygundur.

## Rendering Stratejisi
- Year pages: ISR veya statik üretim
- Entity pages: ISR
- Admin panel: SSR/Auth protected
- Search: dynamic

## Temel Modüller
- Public site
- Data import pipeline
- Review queue
- Admin panel
- Theme engine
- SEO generator
- Knowledge graph engine
