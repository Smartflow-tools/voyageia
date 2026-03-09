import React, { useState, useMemo } from "react";

export default function App() {

const [destination, setDestination] = useState("");
const [trip, setTrip] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState("itinerary");

async function handleGenerate() {

if (!destination.trim()) {
setError("Veuillez entrer une destination.");
return;
}

setLoading(true);
setError(null);
setTrip(null);

try {

const response = await fetch("/.netlify/functions/generate-trip", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
destination: destination,
departureCity: "Paris",
durationDays: 7,
travelers: 2,
budgetLevel: "confort",
travelStyle: "mix",
tripType: "couple",
month: "",
language: "fr"
})
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.error || "Erreur génération guide");
}

setTrip(data);

} catch (err) {

console.error(err);
setError(err.message);

}

setLoading(false);

}

const tabs = useMemo(
() => [
{ id: "itinerary", label: "Itinéraire", icon: "🗺️" },
{ id: "restaurants", label: "Restaurants", icon: "🍽️" },
{ id: "hotels", label: "Hôtels", icon: "🏨" },
{ id: "weather", label: "Météo", icon: "🌤️" },
{ id: "overview", label: "Infos", icon: "✨" }
],
[]
);

function renderItinerary() {

if (!trip?.itinerary) {
return <EmptyBlock text="Aucun itinéraire disponible." />;
}

return trip.itinerary.map((day, i) => (

<div key={i} style={styles.card}>

<h3>
Jour {day.day} — {day.city}
</h3>

<p><strong>Matin</strong> : {day.morning}</p>
<p><strong>Après-midi</strong> : {day.afternoon}</p>
<p><strong>Soir</strong> : {day.evening}</p>

<p style={styles.highlight}>
⭐ {day.highlight}
</p>

</div>

));
}

function renderRestaurants() {

if (!trip?.restaurants || trip.restaurants.length === 0) {
return <EmptyBlock text="Aucun restaurant proposé." />;
}

return trip.restaurants.map((r, i) => (

<div key={i} style={styles.card}>

<h3>{r.name}</h3>

<p><strong>Ville :</strong> {r.city}</p>
<p><strong>Cuisine :</strong> {r.cuisine}</p>
<p><strong>Prix :</strong> {r.price}</p>

<p>{r.must}</p>

<p style={styles.tip}>
💡 {r.tip}
</p>

</div>

));
}

function renderHotels() {

if (!trip?.hotels || trip.hotels.length === 0) {
return <EmptyBlock text="Aucun hôtel proposé." />;
}

return trip.hotels.map((h, i) => (

<div key={i} style={styles.card}>

<h3>{h.name}</h3>

<p>{h.city}</p>

<p>{h.description}</p>

<p style={styles.tag}>
⭐ {h.stars} étoiles • {h.priceRange}
</p>

</div>

));
}

function renderWeather() {

if (!trip?.weather) {
return <EmptyBlock text="Aucune météo disponible." />;
}

return (

<div style={styles.grid2}>

<InfoCard
title="Climat"
value={trip.weather.summary}
icon="🌤️"
/>

<InfoCard
title="Températures"
value={trip.weather.temperatureRange}
icon="🌡️"
/>

<InfoCard
title="Conseils"
value={trip.weather.tips}
icon="🧳"
/>

</div>

);
}

function renderOverview() {

if (!trip) return null;

return (

<div style={styles.grid2}>

<InfoCard
title="Résumé"
value={trip.summary}
icon="✦"
/>

<InfoCard
title="Meilleure période"
value={trip.bestPeriod}
icon="☀️"
/>

<InfoCard
title="Villes"
value={(trip.cities || []).join(" • ")}
icon="📍"
/>

<InfoCard
title="Vol"
value={`${trip.flightOrigin} → ${trip.flightDest}`}
icon="✈️"
/>

<InfoCard
title="Visa"
value={trip.practicalInfo?.visa}
icon="🛂"
/>

<InfoCard
title="Monnaie"
value={trip.practicalInfo?.currency}
icon="💰"
/>

<InfoCard
title="Transport"
value={trip.practicalInfo?.transport}
icon="🚕"
/>

<InfoCard
title="Sécurité"
value={trip.practicalInfo?.safety}
icon="🛡️"
/>

</div>

);
}

function renderTab() {

switch (activeTab) {

case "restaurants":
return renderRestaurants();

case "hotels":
return renderHotels();

case "weather":
return renderWeather();

case "overview":
return renderOverview();

default:
return renderItinerary();

}

}

return (

<div style={styles.app}>

<h1 style={styles.title}>
Ton guide de voyage généré par IA
</h1>

<div style={styles.form}>

<input
type="text"
placeholder="Destination (ex: Japon, Islande, Colombie)"
value={destination}
onChange={(e) => setDestination(e.target.value)}
style={styles.input}
/>

<button
onClick={handleGenerate}
style={styles.button}
>
Générer le guide
</button>

</div>

{loading && <p>Génération du guide en cours...</p>}

{error && (
<p style={{ color: "red" }}>
{error}
</p>
)}

{trip && (

<div>

<h2>
{trip.destination} — {trip.country}
</h2>

<div style={styles.tabs}>

{tabs.map(tab => (

<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
style={{
...styles.tab,
background:
activeTab === tab.id
? "#111"
: "#eee",
color:
activeTab === tab.id
? "#fff"
: "#000"
}}
>

{tab.icon} {tab.label}

</button>

))}

</div>

<div style={styles.content}>

{renderTab()}

</div>

</div>

)}

</div>

);

}

function InfoCard({ title, value, icon }) {

return (

<div style={styles.infoCard}>

<div style={styles.infoTitle}>
{icon} {title}
</div>

<div>
{value}
</div>

</div>

);

}

function EmptyBlock({ text }) {

return (

<div style={styles.empty}>
{text}
</div>

);

}

const styles = {

app: {
maxWidth: "900px",
margin: "auto",
padding: 40,
fontFamily: "Arial"
},

title: {
fontSize: 32,
marginBottom: 30
},

form: {
display: "flex",
gap: 10,
marginBottom: 20
},

input: {
flex: 1,
padding: 10,
fontSize: 16
},

button: {
padding: "10px 16px",
fontSize: 16,
cursor: "pointer"
},

tabs: {
display: "flex",
gap: 10,
marginTop: 20
},

tab: {
padding: "10px 14px",
border: "none",
cursor: "pointer",
borderRadius: 6
},

content: {
marginTop: 20
},

card: {
border: "1px solid #ddd",
padding: 20,
marginBottom: 16,
borderRadius: 8
},

highlight: {
marginTop: 10,
fontWeight: "bold"
},

tip: {
marginTop: 10,
color: "#555"
},

tag: {
marginTop: 8,
color: "#777"
},

grid2: {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 20
},

infoCard: {
border: "1px solid #ddd",
padding: 16,
borderRadius: 8
},

infoTitle: {
fontWeight: "bold",
marginBottom: 8
},

empty: {
padding: 30,
textAlign: "center",
color: "#777"
}

};
