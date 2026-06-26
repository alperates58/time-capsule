# Relationship Model

Bu doküman TimeCapsule Project Bible v2 içinde yer alır. Amaç, Antigravity/Gemini/Codex gibi AI araçlarının projeyi tutarlı şekilde geliştirmesini sağlamaktır.

## Amaç
TimeCapsule'ın gücü ilişkilerden gelir.

## Örnekler
- Movie -> directed_by -> Person
- Movie -> released_in -> Year
- Person -> born_in -> Year
- Person -> died_in -> Year
- Game -> developed_by -> Company
- Award -> won_by -> Entity
- Event -> occurred_in -> Country

## İlişki Alanları
- source_entity_id
- relation_type
- target_entity_id
- start_date
- end_date
- confidence
- source_reference_id

## Kullanıcı Deneyimi
İlişkiler sayesinde kullanıcı dead-end yaşamaz.
