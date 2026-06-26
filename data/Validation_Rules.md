# Validation Rules

## Minimum Alanlar
Entity için en az: type, title, slug, source.

## Tarih Formatı
ISO formatı tercih edilir: YYYY-MM-DD. Sadece yıl biliniyorsa `date_precision = year` tutulur.

## Confidence
- high: birden fazla güvenilir kaynak
- medium: tek güvenilir kaynak
- low: doğrulama bekliyor

## Publish Kuralı
`confidence=low` olan veri review queue'dan geçmeden yayınlanmaz.
