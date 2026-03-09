exports.handler = async function (event) {
try {
if (event.httpMethod !== "POST") {
return {
statusCode: 405,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ error: "Method not allowed" })
};
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

if (!destination || !String(destination).trim()) {
return {
statusCode: 400,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Destination manquante."
})
};
}

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Clé API Anthropic manquante côté serveur."
})
};
}

const prompt = `
Create a travel guide and return ONLY valid JSON.

User context:
- destination: ${destination}
- departure city: ${departureCity}
- duration: ${durationDays} days
- travelers: ${travelers}
- budget: ${budgetLevel}
- style: ${travelStyle}
- trip type: ${tripType}
- month: ${month}
- language: ${language}

Return EXACTLY this JSON structure:
{
"destination": "string",
"country": "string",
"duration": number,
"departureCity": "string",
"travelers": number,
"style": "string",
"budget": "string",
"summary": "string",
"bestPeriod": "string",
"cities": ["string"],
"flightOrigin": "string",
"flightDest": "string",
"distanceKm": number,
"itinerary": [
{
"day": number,
"city": "string",
"title": "string",
"morning": "string",
"afternoon": "string",
"evening": "string",
"highlight": "string"
}
],
"hotels": [
{
"city": "string",
"name": "string",
"type": "string",
"stars": number,
"priceRange": "string",
"description": "string",
"tags": ["string"]
}
],
"restaurants": [
{
"city": "string",
"name": "string",
"cuisine": "string",
"price": "string",
"must": "string",
"address": "string",
"tip": "string"
}
]
}

Rules:
- Strict RFC8259 JSON only
- No markdown
- No explanation before or after JSON
- Exactly ${durationDays} objects in itinerary
- Use only ASCII characters
- No emojis
- No apostrophes in values
- All values must stay on one line
- All text must be written in ${language}
- Hotels and restaurants arrays can contain 3 to 6 items
`;

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
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: data?.error?.message || "Erreur API Anthropic"
})
};
}

const text = data?.content?.[0]?.text || "";

if (!text) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Réponse IA vide"
})
};
}

const cleanedText = text
.replace(/```json/g, "")
.replace(/```/g, "")
.trim();

let guide;

try {
guide = JSON.parse(cleanedText);
} catch (e) {
const start = cleanedText.indexOf("{");
const end = cleanedText.lastIndexOf("}") + 1;

if (start === -1 || end === 0) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Aucun JSON trouvé dans la réponse IA",
preview: cleanedText.slice(0, 500)
})
};
}

let jsonString = cleanedText.slice(start, end);

jsonString = jsonString
.replace(/\n/g, " ")
.replace(/\r/g, " ")
.replace(/\t/g, " ")
.replace(/[^\x00-\x7F]/g, "")
.replace(/'/g, "");

try {
guide = JSON.parse(jsonString);
} catch (e2) {
const match = String(e2.message).match(/position (\d+)/);
const pos = match ? Number(match[1]) : 0;
const startPreview = Math.max(0, pos - 120);
const endPreview = Math.min(jsonString.length, pos + 120);
const preview = jsonString.slice(startPreview, endPreview);

return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: e2.message,
preview
})
};
}
}

// Normalisation / sécurisation
guide = guide || {};

guide.destination = guide.destination || destination;
guide.country = guide.country || "";
guide.duration = Number(guide.duration || durationDays);
guide.departureCity = guide.departureCity || departureCity;
guide.travelers = Number(guide.travelers || travelers);
guide.style = guide.style || travelStyle;
guide.budget = guide.budget || budgetLevel;
guide.summary = guide.summary || "";
guide.bestPeriod = guide.bestPeriod || "";
guide.cities = Array.isArray(guide.cities) ? guide.cities : [];
guide.flightOrigin = guide.flightOrigin || departureCity.slice(0, 3).toUpperCase();
guide.flightDest = guide.flightDest || destination.slice(0, 3).toUpperCase();
guide.distanceKm = Number(guide.distanceKm || 0);

guide.itinerary = Array.isArray(guide.itinerary) ? guide.itinerary : [];
guide.hotels = Array.isArray(guide.hotels) ? guide.hotels : [];
guide.restaurants = Array.isArray(guide.restaurants) ? guide.restaurants : [];

// Champs optionnels vides pour ne pas casser le front actuel
guide.health = guide.health || {
vaccines: [],
pharmacies: [],
hospitals: [],
tips: []
};

guide.carbon = guide.carbon || {
flightCO2: 0,
localTransportCO2: 0,
accommodationCO2: 0,
totalPerPerson: 0,
equivalences: [],
offsets: []
};

guide.family = guide.family || {
suitable: false,
minAge: 0,
activities: [],
strollerAccessibility: "",
familyHotels: [],
tips: []
};

guide.practicalInfo = guide.practicalInfo || {
visa: { icon: "VISA", label: "Visa", value: "" },
currency: { icon: "MONEY", label: "Monnaie", value: "" },
language: { icon: "LANG", label: "Langue", value: "" },
transport: { icon: "BUS", label: "Transport", value: "" },
safety: { icon: "SAFE", label: "Securite", value: "" },
health: { icon: "HEALTH", label: "Sante", value: "" },
electricity: { icon: "ELEC", label: "Electricite", value: "" },
emergency: { icon: "SOS", label: "Urgences", value: "" }
};

guide.checklist = guide.checklist || {
documents: { icon: "DOC", label: "Documents", items: [] },
clothing: { icon: "CLOTH", label: "Vetements", items: [] },
health: { icon: "HEALTH", label: "Sante", items: [] },
tech: { icon: "TECH", label: "Tech", items: [] },
misc: { icon: "MISC", label: "Divers", items: [] }
};

guide.photoSpots = Array.isArray(guide.photoSpots) ? guide.photoSpots : [];
guide.phrasebook = Array.isArray(guide.phrasebook) ? guide.phrasebook : [];
guide.reminders = Array.isArray(guide.reminders) ? guide.reminders : [];
guide.budgetItems = Array.isArray(guide.budgetItems) ? guide.budgetItems : [];

return {
statusCode: 200,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(guide)
};
} catch (error) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: error.message
})
};
}
};
