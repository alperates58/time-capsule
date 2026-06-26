# Deployment Coolify

Bu doküman TimeCapsule Project Bible v2 içinde yer alır. Amaç, Antigravity/Gemini/Codex gibi AI araçlarının projeyi tutarlı şekilde geliştirmesini sağlamaktır.

## Hedef Akış
GitHub push -> Coolify build -> Docker deploy -> timecapsule.alperates.com.tr

## Gerekenler
- Dockerfile
- docker-compose veya Coolify app config
- Environment variables
- PostgreSQL service
- Healthcheck endpoint

## Domain
Cloudflare DNS: `timecapsule.alperates.com.tr` Coolify app'e yönlenir.
