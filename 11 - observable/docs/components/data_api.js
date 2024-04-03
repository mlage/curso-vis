export async function load_movies() {
  // api endpoint
  const url = "https://cdn.jsdelivr.net/npm/vega-datasets@2.8.1/data/cars.json";
  // Fetch json data.
  const response = await fetch(url);

  // Check response
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  const collection = await response.json();

  // Return data
  return collection;
}



