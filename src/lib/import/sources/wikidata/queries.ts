export const getEventsByYear = (year: number, limit: number) => `
SELECT ?item ?itemLabel ?itemDescription ?date
WHERE {
  ?item wdt:P31/wdt:P279* wd:Q1190554.
  ?item wdt:P585 ?date.
  FILTER(YEAR(?date) = ${year})
  FILTER(LANG(?itemLabel) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${limit}
`;

export const getFilmsByYear = (year: number, limit: number) => `
SELECT ?item ?itemLabel ?itemDescription ?date
WHERE {
  ?item wdt:P31 wd:Q11424.
  ?item wdt:P577 ?date.
  FILTER(YEAR(?date) = ${year})
  FILTER(LANG(?itemLabel) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${limit}
`;

export const getBirthsByYear = (year: number, limit: number) => `
SELECT ?item ?itemLabel ?itemDescription ?date
WHERE {
  ?item wdt:P31 wd:Q5.
  ?item wdt:P569 ?date.
  FILTER(YEAR(?date) = ${year})
  FILTER(LANG(?itemLabel) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${limit}
`;

export const getDeathsByYear = (year: number, limit: number) => `
SELECT ?item ?itemLabel ?itemDescription ?date
WHERE {
  ?item wdt:P31 wd:Q5.
  ?item wdt:P570 ?date.
  FILTER(YEAR(?date) = ${year})
  FILTER(LANG(?itemLabel) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${limit}
`;
