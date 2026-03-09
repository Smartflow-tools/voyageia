exports.handler = async function (event) {
try {
if (event.httpMethod !== "POST") {
return jsonResponse(405, { error: "Method not allowed" });
}

const body = JSON.parse(event.body || "{}");

const {
destination = "",
departureCity = "Paris",
durationDays = 7,
travelers = 2,
budgetLevel = "confort",
travelStyle = "mix",
tripType = "couple",
month = "",
language = "fr"
} = body;

if (!String(destination).trim()) {
return jsonResponse(400, { error: "Destination manquante." });
}

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
return jsonResponse(500, {
error: "Clé API Anthropic manquante côté serveur."
});
}

const prompt = buildPrompt({
destination,
departureCity,
durationDays,
travelers,
budgetLevel,
travelStyle,
tripType,
month,
language
});

const response = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {
"content-type": "application/json",
"x-api-key": apiKey,
"anthropic-version": "2023-06-01"
},
body: JSON.stringify({
model: "claude-haiku-4-5-20251001",
max_tokens: 2200,
temperature: 0.2,
messages: [
{
role: "user",
content: prompt
}
]
})
});

const data = await response.json();

if (!response.ok) {
return jsonResponse(500, {
error: data?.error?.message || "Erreur API Anthropic"
});
}

const text = data?.content?.[0]?.text || "";

if (!text.trim()) {
return jsonResponse(500, { error: "Réponse IA vide" });
}

const guide = parseStructuredGuide(text, {
destination,
departureCity,
durationDays,
travelers,
budgetLevel,
travelStyle
});

return jsonResponse(200, guide);
} catch (error) {
return jsonResponse(500, {
error: error.message || "Erreur serveur"
});
}
};

function jsonResponse(statusCode, payload) {
return {
statusCode,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
};
}

function buildPrompt({
destination,
departureCity,
durationDays,
travelers,
budgetLevel,
travelStyle,
tripType,
month,
language
}) {
return `
You are creating a travel guide.

Return ONLY plain text using the exact field markers below.
Do NOT return JSON.
Do NOT use markdown.
Do NOT add commentary before or after.
Write all content in ${language}.
Use simple ASCII punctuation only.

USER INPUT
DESTINATION: ${destination}
DEPARTURE_CITY: ${departureCity}
DURATION_DAYS: ${durationDays}
TRAVELERS: ${travelers}
BUDGET: ${budgetLevel}
STYLE: ${travelStyle}
TRIP_TYPE: ${tripType}
MONTH: ${month}

OUTPUT FORMAT

DESTINATION: ...
COUNTRY: ...
DURATION: ...
DEPARTURE_CITY: ...
TRAVELERS: ...
STYLE: ...
BUDGET: ...
SUMMARY: ...
BEST_PERIOD: ...
CITIES: city1 | city2 | city3
FLIGHT_ORIGIN: ...
FLIGHT_DEST: ...
DISTANCE_KM: ...

ITINERARY_START
DAY: 1
CITY: ...
TITLE: ...
MORNING: ...
AFTERNOON: ...
EVENING: ...
HIGHLIGHT: ...
DAY_END

DAY: 2
CITY: ...
TITLE: ...
MORNING: ...
AFTERNOON: ...
EVENING: ...
HIGHLIGHT: ...
DAY_END
ITINERARY_END

HOTELS_START
HOTEL:
CITY: ...
NAME: ...
TYPE: ...
STARS: ...
PRICE_RANGE: ...
DESCRIPTION: ...
TAGS: tag1 | tag2 | tag3
HOTEL_END
HOTELS_END

RESTAURANTS_START
RESTAURANT:
CITY: ...
NAME: ...
CUISINE: ...
PRICE: ...
MUST: ...
ADDRESS: ...
TIP: ...
RESTAURANT_END
RESTAURANTS_END

RULES
- Exactly ${durationDays} days in itinerary
- 3 to 5 hotels total
- 3 to 6 restaurants total
- Keep every field on a single line
- No bullets
- No markdown
- No JSON
- Do not skip any required markers
`;
}

function parseStructuredGuide(text, defaults) {
const normalized = text
.replace(/\r/g, "")
.replace(/[“”]/g, '"')
.replace(/[‘’]/g, "'")
.trim();

const header = extractHeaderFields(normalized);

const itineraryBlock = extractBlock(normalized, "ITINERARY_START", "ITINERARY_END");
const hotelsBlock = extractBlock(normalized, "HOTELS_START", "HOTELS_END");
const restaurantsBlock = extractBlock(normalized, "RESTAURANTS_START", "RESTAURANTS_END");

const itinerary = parseItinerary(itineraryBlock, defaults.durationDays);
const hotels = parseHotels(hotelsBlock);
const restaurants = parseRestaurants(restaurantsBlock);

return {
destination: header.DESTINATION || defaults.destination,
country: header.COUNTRY || "",
duration: toNumber(header.DURATION, defaults.durationDays),
departureCity: header.DEPARTURE_CITY || defaults.departureCity,
travelers: toNumber(header.TRAVELERS, defaults.travelers),
style: header.STYLE || defaults.travelStyle,
budget: header.BUDGET || defaults.budgetLevel,
summary: header.SUMMARY || "",
bestPeriod: header.BEST_PERIOD || "",
cities: splitPipeList(header.CITIES),
flightOrigin:
header.FLIGHT_ORIGIN || defaults.departureCity.slice(0, 3).toUpperCase(),
flightDest:
header.FLIGHT_DEST || defaults.destination.slice(0, 3).toUpperCase(),
distanceKm: toNumber(header.DISTANCE_KM, 0),
itinerary,
hotels,
restaurants
};
}

function extractHeaderFields(text) {
const fields = {};
const keys = [
"DESTINATION",
"COUNTRY",
"DURATION",
"DEPARTURE_CITY",
"TRAVELERS",
"STYLE",
"BUDGET",
"SUMMARY",
"BEST_PERIOD",
"CITIES",
"FLIGHT_ORIGIN",
"FLIGHT_DEST",
"DISTANCE_KM"
];

for (const key of keys) {
fields[key] = extractSingleField(text, key);
}

return fields;
}

function extractSingleField(text, key) {
const regex = new RegExp(`^${escapeRegex(key)}:\\s*(.*)$`, "m");
const match = text.match(regex);
return match ? match[1].trim() : "";
}

function extractBlock(text, startMarker, endMarker) {
const start = text.indexOf(startMarker);
const end = text.indexOf(endMarker);

if (start === -1 || end === -1 || end <= start) {
return "";
}

return text.slice(start + startMarker.length, end).trim();
}

function parseItinerary(block, expectedDays) {
if (!block) {
return buildFallbackItinerary(expectedDays);
}

const rawDays = block
.split("DAY_END")
.map((part) => part.trim())
.filter(Boolean);

const parsed = rawDays.map((part, index) => {
return {
day: toNumber(extractSingleField(part, "DAY"), index + 1),
city: extractSingleField(part, "CITY"),
title: extractSingleField(part, "TITLE"),
morning: extractSingleField(part, "MORNING"),
afternoon: extractSingleField(part, "AFTERNOON"),
evening: extractSingleField(part, "EVENING"),
highlight: extractSingleField(part, "HIGHLIGHT")
};
});

if (!parsed.length) {
return buildFallbackItinerary(expectedDays);
}

while (parsed.length < expectedDays) {
parsed.push({
day: parsed.length + 1,
city: parsed[parsed.length - 1]?.city || "",
title: `Jour ${parsed.length + 1}`,
morning: "",
afternoon: "",
evening: "",
highlight: ""
});
}

return parsed.slice(0, expectedDays);
}

function parseHotels(block) {
if (!block) return [];

return block
.split("HOTEL_END")
.map((part) => part.trim())
.filter((part) => part && part.includes("HOTEL:"))
.map((part) => ({
city: extractSingleField(part, "CITY"),
name: extractSingleField(part, "NAME"),
type: extractSingleField(part, "TYPE"),
stars: toNumber(extractSingleField(part, "STARS"), 0),
priceRange: extractSingleField(part, "PRICE_RANGE"),
description: extractSingleField(part, "DESCRIPTION"),
tags: splitPipeList(extractSingleField(part, "TAGS"))
}))
.filter((hotel) => hotel.name);
}

function parseRestaurants(block) {
if (!block) return [];

return block
.split("RESTAURANT_END")
.map((part) => part.trim())
.filter((part) => part && part.includes("RESTAURANT:"))
.map((part) => ({
city: extractSingleField(part, "CITY"),
name: extractSingleField(part, "NAME"),
cuisine: extractSingleField(part, "CUISINE"),
price: extractSingleField(part, "PRICE"),
must: extractSingleField(part, "MUST"),
address: extractSingleField(part, "ADDRESS"),
tip: extractSingleField(part, "TIP")
}))
.filter((restaurant) => restaurant.name);
}

function splitPipeList(value) {
if (!value) return [];
return value
.split("|")
.map((item) => item.trim())
.filter(Boolean);
}

function toNumber(value, fallback) {
const n = Number(String(value || "").replace(/[^\d.-]/g, ""));
return Number.isFinite(n) ? n : fallback;
}

function buildFallbackItinerary(days) {
return Array.from({ length: days }, (_, i) => ({
day: i + 1,
city: "",
title: `Jour ${i + 1}`,
morning: "",
afternoon: "",
evening: "",
highlight: ""
}));
}

function escapeRegex(value) {
return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
