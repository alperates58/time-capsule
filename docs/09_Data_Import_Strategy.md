# Data Import Strategy

Bu doküman TimeCapsule Project Bible v2 içinde yer alır. Amaç, Antigravity/Gemini/Codex gibi AI araçlarının projeyi tutarlı şekilde geliştirmesini sağlamaktır.

## Ana Felsefe
AI verinin kaynağı değildir. Kaynaklar API/dataset/açık veri olmalıdır.

## Akış
Source -> Import Script -> Normalize -> Validate -> Review Queue -> Publish

## Kaynak Tipleri
- API
- Open dataset
- Manual curated data
- AI-assisted research

## Review Queue
Kaynak eksikse, tarih çelişkiliyse veya duplicate şüphesi varsa veri otomatik yayına alınmaz.
