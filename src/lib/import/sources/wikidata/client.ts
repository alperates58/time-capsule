const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

export async function fetchWikidata(sparqlQuery: string) {
  const url = `${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(sparqlQuery)}`;
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/sparql-results+json",
      "User-Agent": "TimeCapsuleImporter/1.0 (Contact: local@timecapsule.com)"
    }
  });

  if (!response.ok) {
    throw new Error(`Wikidata API responded with status: ${response.status}`);
  }

  const data = await response.json();
  return data.results.bindings;
}
