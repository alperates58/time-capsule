# Database Strategy

Bu doküman TimeCapsule Project Bible v2 içinde yer alır. Amaç, Antigravity/Gemini/Codex gibi AI araçlarının projeyi tutarlı şekilde geliştirmesini sağlamaktır.

## Yaklaşım
Her şey entity olarak modellenir. Yıl, kategori, kaynak, ilişki ve medya entity'leri birbirine bağlanır.

## Ana Tablolar
- entities
- entity_types
- years
- categories
- entity_years
- entity_relations
- sources
- source_references
- media_assets
- import_batches
- review_queue
- year_themes

## Kritik Kural
"1998_movies" gibi yıl bazlı tablolar oluşturulmaz. Veri normalize edilir.

## Duplicate Önleme
- slug
- external ids
- aliases
- date + type + title kombinasyonu
- review queue kontrolü
