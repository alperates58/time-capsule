# Coolify Deployment

## Hedef
GitHub repo Coolify'a bağlanacak. Her push sonrası otomatik build ve redeploy yapılacak.

## Domain
`timecapsule.alperates.com.tr`

## Gerekenler
- Dockerfile
- Healthcheck route
- Environment variables
- PostgreSQL service veya external DB
- Cloudflare DNS kaydı

## İlk Deploy Stratejisi
Önce static/SSR çalışan Next.js app deploy edilir. DB daha sonraki phase'de eklenebilir.
