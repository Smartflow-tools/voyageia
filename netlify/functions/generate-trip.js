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

return {
statusCode: 200,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
destination,
country: "Test",
duration: durationDays,
departureCity,
travelers,
style: travelStyle,
budget: budgetLevel,
summary: "Test OK",
bestPeriod: month || "Toute l'année",
cities: [destination],
flightOrigin: departureCity.slice(0, 3).toUpperCase(),
flightDest: destination.slice(0, 3).toUpperCase(),
distanceKm: 1000,
itinerary: [
{
day: 1,
city: destination,
title: "Jour test",
morning: "Test matin",
afternoon: "Test après-midi",
evening: "Test soirée",
highlight: "Test highlight"
}
],
hotels: [],
restaurants: [],
health: { vaccines: [], pharmacies: [], hospitals: [], tips: [] },
carbon: {
flightCO2: 0.5,
localTransportCO2: 0.1,
accommodationCO2: 0.1,
totalPerPerson: 0.7,
equivalences: [],
offsets: []
},
family: {
suitable: true,
minAge: 3,
activities: [],
strollerAccessibility: "Test",
familyHotels: [],
tips: []
},
practicalInfo: {
visa: { icon: "🛂", label: "Visa", value: "Test" },
currency: { icon: "💰", label: "Monnaie", value: "Test" },
language: { icon: "🗣️", label: "Langue", value: "Test" },
transport: { icon: "🚌", label: "Transport", value: "Test" },
safety: { icon: "🛡️", label: "Sécurité", value: "Test" },
health: { icon: "💊", label: "Santé", value: "Test" },
electricity: { icon: "🔌", label: "Électricité", value: "Test" },
emergency: { icon: "🆘", label: "Urgences", value: "Test" }
},
checklist: {
documents: { icon: "📋", label: "Documents", items: [] },
clothing: { icon: "👕", label: "Vêtements", items: [] },
health: { icon: "💊", label: "Santé", items: [] },
tech: { icon: "📱", label: "Tech", items: [] },
misc: { icon: "🎒", label: "Divers", items: [] }
},
photoSpots: [],
phrasebook: [],
reminders: [],
budgetItems: []
})
};

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
Tu génères un guide de voyage premium en JSON strict.
Réponds uniquement avec un JSON valide.
Aucun markdown. Aucun texte avant ou après le JSON.

Contexte utilisateur :
- destination: ${destination}
- ville de départ: ${departureCity}
- durée: ${durationDays} jours
- voyageurs: ${travelers}
- budget: ${budgetLevel}
- style: ${travelStyle}
- type de voyage: ${tripType}
- mois: ${month}
- langue: ${language}

Contraintes :
- Le résultat doit être réaliste, cohérent, utile et vendable.
- Tous les textes doivent être écrits en ${language}.
- L’itinéraire doit contenir exactement ${durationDays} jours.
- Si une information précise est incertaine, reste utile mais prudent.
- Si une URL exacte n’est pas certaine, utilise une URL de recherche générique.
- Réponds exactement avec cette structure JSON :

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
"bookingUrl": "string",
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
],
"health": {
"vaccines": [
{
"name": "string",
"required": false,
"recommended": true,
"note": "string"
}
],
"pharmacies": [
{
"city": "string",
"name": "string",
"address": "string",
"phone": "string",
"hours": "string"
}
],
"hospitals": [
{
"city": "string",
"name": "string",
"phone": "string",
"type": "string"
}
],
"tips": ["string"]
},
"carbon": {
"flightCO2": number,
"localTransportCO2": number,
"accommodationCO2": number,
"totalPerPerson": number,
"equivalences": [
{
"label": "string",
"value": number
}
],
"offsets": [
{
"name": "string",
"url": "string",
"price": "string",
"description": "string"
}
]
},
"family": {
"suitable": true,
"minAge": number,
"activities": [
{
"name": "string",
"city": "string",
"ageMin": number,
"description": "string"
}
],
"strollerAccessibility": "string",
"familyHotels": ["string"],
"tips": ["string"]
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
"documents": { "icon": "📋", "label": "Documents", "items": ["string"] },
"clothing": { "icon": "👕", "label": "Vêtements", "items": ["string"] },
"health": { "icon": "💊", "label": "Santé", "items": ["string"] },
"tech": { "icon": "📱", "label": "Tech", "items": ["string"] },
"misc": { "icon": "🎒", "label": "Divers", "items": ["string"] }
},
"photoSpots": [
{
"city": "string",
"spot": "string",
"time": "string",
"tip": "string"
}
],
"phrasebook": [
{
"fr": "string",
"local": "string",
"phonetic": "string",
"category": "string"
}
],
"reminders": [
{
"timing": "string",
"tasks": ["string"]
}
],
"budgetItems": [
{
"category": "string",
"icon": "string",
"low": number,
"mid": number,
"high": number,
"unit": "string",
"note": "string"
}
]
}
`;

const response = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {
"content-type": "application/json",
"x-api-key": apiKey,
"anthropic-version": "2023-06-01"
},
body: JSON.stringify({
model: "claude-sonnet-4-6",
max_tokens: 12000,
temperature: 0.4,
messages: [
{
role: "user",
content: prompt
}
]
})
});

if (!response.ok) {
const details = await response.text();
return {
statusCode: response.status,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Erreur Anthropic",
details
})
};
}

const data = await response.json();
const text = data?.content?.[0]?.text || "";

let trip;
try {
trip = JSON.parse(text);
} catch (e) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Réponse IA invalide (JSON non lisible).",
raw: text
})
};
}

return {
statusCode: 200,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(trip)
};
} catch (error) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
error: "Erreur serveur",
details: error.message
})
};
}
};

