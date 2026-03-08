exports.handler = async function (event) {
if (event.httpMethod !== "POST") {
return {
statusCode: 405,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ error: "Method not allowed" })
};
}

try {
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
body: JSON.stringify({ error: "Destination manquante." })
};
}

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ error: "Clé API Anthropic manquante côté serveur." })
};
}

const prompt = `
Crée un guide de voyage en JSON valide uniquement.

Destination: ${destination}
Ville de départ: ${departureCity}
Durée: ${durationDays} jours
Voyageurs: ${travelers}
Budget: ${budgetLevel}
Style: ${travelStyle}
Type: ${tripType}
Mois: ${month}
Langue: ${language}

Réponds avec un JSON strict contenant exactement cette structure :
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
"hotels": [],
"restaurants": [],
"health": { "vaccines": [], "pharmacies": [], "hospitals": [], "tips": [] },
"carbon": {
"flightCO2": number,
"localTransportCO2": number,
"accommodationCO2": number,
"totalPerPerson": number,
"equivalences": [],
"offsets": []
},
"family": {
"suitable": true,
"minAge": number,
"activities": [],
"strollerAccessibility": "string",
"familyHotels": [],
"tips": []
},
"practicalInfo": {
"visa": { "icon": "🛂", "label": "Visa", "value": "string" },
"currency": { "icon": "💰", "label": "Monnaie", "value": "string" },
"language": { "icon": "🗣️", "label": "Langue", "value": "string" },
"transport": { "icon": "🚌", "label": "Transport", "value": "string" },
"safety": { "icon": "🛡️", "label": "Sécurité", "value": "string" },
"health": { "icon": "💊", "label": "Santé", "value": "string" },
"electricity": { "icon": "🔌", "label": "Électricité", "value": "string" },
"emergency": { "icon": "🆘", "label": "Urgences", "value": "string" }
},
"checklist": {
"documents": { "icon": "📋", "label": "Documents", "items": [] },
"clothing": { "icon": "👕", "label": "Vêtements", "items": [] },
"health": { "icon": "💊", "label": "Santé", "items": [] },
"tech": { "icon": "📱", "label": "Tech", "items": [] },
"misc": { "icon": "🎒", "label": "Divers", "items": [] }
},
"photoSpots": [],
"phrasebook": [],
"reminders": [],
"budgetItems": []
}

Important :
- JSON valide uniquement
- exactement ${durationDays} objets dans itinerary
- pas de markdown
- pas de texte avant ou après
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
max_tokens: 2500,
temperature: 0.3,
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
error: data.error?.message || "Erreur API Anthropic"
})
};
}

const text = data.content[0].text;

let guide;

try {
guide = JSON.parse(text);
} catch (e) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Réponse IA non JSON."
})
};
}

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
