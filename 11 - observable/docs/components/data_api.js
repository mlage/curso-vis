export async function load_movies() {
  // api endpoint
  const url = "https://data.cityofnewyork.us/resource/tg4x-b46p.json?$query=SELECT%0A%20%20%60eventid%60%2C%0A%20%20%60eventtype%60%2C%0A%20%20%60startdatetime%60%2C%0A%20%20%60enddatetime%60%2C%0A%20%20%60enteredon%60%2C%0A%20%20%60eventagency%60%2C%0A%20%20%60parkingheld%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60communityboard_s%60%2C%0A%20%20%60policeprecinct_s%60%2C%0A%20%20%60category%60%2C%0A%20%20%60subcategoryname%60%2C%0A%20%20%60country%60%2C%0A%20%20%60zipcode_s%60%0AWHERE%0A%20%20(%60startdatetime%60%0A%20%20%20%20%20BETWEEN%20%222023-06-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20%20AND%20%222023-12-31T23%3A45%3A00%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20(caseless_eq(%60borough%60%2C%20%22Manhattan%22)%0A%20%20%20%20%20%20%20%20%20AND%20caseless_one_of(%60eventtype%60%2C%20%22Shooting%20Permit%22))%0AORDER%20BY%20%60enteredon%60%20DESC%20NULL%20FIRST";

  // Fetch json data.
  const response = await fetch(url);

  // Check response
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  const collection = await response.json();

  // Return data
  return collection;
}



