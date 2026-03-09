import React, { useState } from "react";

function App() {

const [destination, setDestination] = useState("");
const [trip, setTrip] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

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

return (
<div className="app">

<h1>AI Travel Planner</h1>

<div className="form">

<input
type="text"
placeholder="Destination (ex: Japon, Colombie, Islande)"
value={destination}
onChange={(e) => setDestination(e.target.value)}
/>

<button onClick={handleGenerate}>
Générer le guide
</button>

</div>

{loading && (
<p>Génération du guide en cours...</p>
)}

{error && (
<p style={{color:"red"}}>{error}</p>
)}

{trip && (
<div className="trip">

<h2>{trip.destination} - {trip.country}</h2>

<p>{trip.summary}</p>

<h3>Meilleure période</h3>
<p>{trip.bestPeriod}</p>

<h3>Itinéraire</h3>

{trip.itinerary && trip.itinerary.map((day, i) => (

<div key={i} className="day">

<h4>Jour {day.day} - {day.city}</h4>

<p><strong>Matin:</strong> {day.morning}</p>

<p><strong>Après-midi:</strong> {day.afternoon}</p>

<p><strong>Soir:</strong> {day.evening}</p>

<p><strong>Highlight:</strong> {day.highlight}</p>

</div>

))}

<h3>Hôtels</h3>

{trip.hotels && trip.hotels.map((h, i) => (

<div key={i}>
<strong>{h.name}</strong> - {h.city}
<p>{h.description}</p>
</div>

))}

<h3>Restaurants</h3>

{trip.restaurants && trip.restaurants.map((r, i) => (

<div key={i}>
<strong>{r.name}</strong> - {r.city}
<p>{r.must}</p>
</div>

))}

</div>
)}

</div>
);

}

export default App; 
