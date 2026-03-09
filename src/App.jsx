import React, { useMemo, useState } from "react";

export default function App() {
const [destination, setDestination] = useState("");
const [departureCity, setDepartureCity] = useState("Paris");
const [durationDays, setDurationDays] = useState(7);
const [travelers, setTravelers] = useState(2);
const [budgetLevel, setBudgetLevel] = useState("confort");
const [travelStyle, setTravelStyle] = useState("mix");
const [tripType, setTripType] = useState("couple");
const [month, setMonth] = useState("");
const [language, setLanguage] = useState("fr");

const [trip, setTrip] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState("itinerary");
const [openDays, setOpenDays] = useState({});

const tabs = useMemo(
() => [
{ id: "itinerary", label: "Itinéraire", icon: "🗺️" },
{ id: "restaurants", label: "Restaurants", icon: "🍽️" },
{ id: "hotels", label: "Hôtels", icon: "🏨" },
{ id: "weather", label: "Météo", icon: "🌤️" },
{ id: "flights", label: "Vols", icon: "✈️" },
{ id: "map", label: "Carte", icon: "📍" },
{ id: "overview", label: "Infos", icon: "✨" }
],
[]
);

async function handleGenerate() {
if (!destination.trim()) {
setError("Veuillez entrer une destination.");
return;
}

setLoading(true);
setError(null);
setTrip(null);
setActiveTab("itinerary");
setOpenDays({});

try {
const response = await fetch("/.netlify/functions/generate-trip", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
destination,
departureCity,
durationDays: Number(durationDays),
travelers: Number(travelers),
budgetLevel,
travelStyle,
tripType,
month,
language
})
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.error || "Erreur génération guide");
}

setTrip(data);

const initialOpen = {};
(data.itinerary || []).forEach((_, index) => {
initialOpen[index] = index === 0;
});
setOpenDays(initialOpen);
} catch (err) {
console.error(err);
setError(err.message || "Erreur pendant la génération.");
} finally {
setLoading(false);
}
}

function toggleDay(index) {
setOpenDays((prev) => ({
...prev,
[index]: !prev[index]
}));
}

function buildGoogleMapsLink(query) {
return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

function buildSkyscannerLink() {
const origin = trip?.flightOrigin || departureCity || "PAR";
const dest = trip?.flightDest || destination || "";
return `https://www.skyscanner.fr/transport/vols/${encodeURIComponent(
origin
)}/${encodeURIComponent(dest)}/`;
}

function buildGoogleFlightsLink() {
const origin = trip?.flightOrigin || departureCity || "PAR";
const dest = trip?.flightDest || destination || "";
return `https://www.google.com/travel/flights?q=${encodeURIComponent(
`flights ${origin} to ${dest}`
)}`;
}

function estimateBudget() {
const level = String(trip?.budget || budgetLevel).toLowerCase();
const days = Number(trip?.duration || durationDays || 7);
const pax = Number(trip?.travelers || travelers || 2);

let dailyPerPerson = 0;
if (level.includes("budget")) dailyPerPerson = 80;
else if (level.includes("luxe")) dailyPerPerson = 260;
else dailyPerPerson = 150;

const total = days * pax * dailyPerPerson;
return `${total.toLocaleString("fr-FR")} € estimés`;
}

function renderOverview() {
if (!trip) return null;

return (
<div style={{ display: "grid", gap: 18 }}>
<div style={styles.heroInfoGrid}>
<StatCard label="Destination" value={trip.destination || destination} />
<StatCard label="Durée" value={`${trip.duration || durationDays} jours`} />
<StatCard label="Voyageurs" value={`${trip.travelers || travelers}`} />
<StatCard label="Budget" value={trip.budget || budgetLevel} />
<StatCard label="Période" value={trip.bestPeriod || "Non précisée"} />
<StatCard label="Budget estimatif" value={estimateBudget()} />
</div>

<div style={styles.grid2}>
<InfoCard title="Résumé" value={trip.summary || "Résumé non disponible."} icon="✦" />
<InfoCard
title="Villes"
value={(trip.cities || []).join(" • ") || "Non précisées"}
icon="📍"
/>
<InfoCard
title="Visa"
value={trip.practicalInfo?.visa || "Non précisé"}
icon="🛂"
/>
<InfoCard
title="Monnaie"
value={trip.practicalInfo?.currency || "Non précisée"}
icon="💰"
/>
<InfoCard
title="Transport"
value={trip.practicalInfo?.transport || "Non précisé"}
icon="🚕"
/>
<InfoCard
title="Sécurité"
value={trip.practicalInfo?.safety || "Non précisée"}
icon="🛡️"
/>
</div>
</div>
);
}

function renderItinerary() {
if (!trip?.itinerary?.length) {
return <EmptyBlock text="Aucun itinéraire disponible." />;
}

return (
<div style={{ display: "grid", gap: 16 }}>
{trip.itinerary.map((day, index) => {
const isOpen = !!openDays[index];
return (
<div key={index} style={styles.dayCard}>
<button type="button" onClick={() => toggleDay(index)} style={styles.dayHeader}>
<div style={styles.dayHeaderLeft}>
<div style={styles.dayNumber}>
{String(day.day || index + 1).padStart(2, "0")}
</div>
<div>
<div style={styles.dayCity}>{day.city || "Étape"}</div>
<div style={styles.dayTitle}>
{day.title || `Jour ${day.day || index + 1}`}
</div>
{day.highlight ? (
<div style={styles.dayHighlight}>✦ {day.highlight}</div>
) : null}
</div>
</div>
<div style={styles.chevron}>{isOpen ? "−" : "+"}</div>
</button>

{isOpen ? (
<div style={styles.dayBody}>
<TimeCard label="Matin" text={day.morning} />
<TimeCard label="Après-midi" text={day.afternoon} />
<TimeCard label="Soir" text={day.evening} />
</div>
) : null}
</div>
);
})}
</div>
);
}

function renderRestaurants() {
if (!trip?.restaurants?.length) {
return <EmptyBlock text="Aucun restaurant disponible." />;
}

return (
<div style={styles.cardGrid}>
{trip.restaurants.map((restaurant, index) => (
<div key={index} style={styles.premiumCard}>
<div style={styles.cardTopRow}>
<div style={styles.cardTopMeta}>🍽️ {restaurant.city || trip?.destination || "Ville"}</div>
<span style={styles.priceChip}>{restaurant.price || "€€"}</span>
</div>

<div style={styles.cardTitleLg}>{restaurant.name || "Restaurant"}</div>
<div style={styles.subMeta}>{restaurant.cuisine || "Cuisine locale"}</div>

<div style={styles.sectionLine}>
<span style={styles.sectionLabel}>À goûter</span>
<p style={styles.cardText}>{restaurant.must || "Spécialité à découvrir."}</p>
</div>

{restaurant.address ? (
<p style={styles.smallMuted}>📍 {restaurant.address}</p>
) : null}

{restaurant.tip ? (
<p style={styles.tipText}>💡 {restaurant.tip}</p>
) : null}

<a
href={buildGoogleMapsLink(
`${restaurant.name || "restaurant"} ${restaurant.city || trip?.destination || destination}`
)}
target="_blank"
rel="noopener noreferrer"
style={styles.linkButton}
>
Voir sur Google Maps ↗
</a>
</div>
))}
</div>
);
}

function renderHotels() {
if (!trip?.hotels?.length) {
return <EmptyBlock text="Aucun hôtel disponible." />;
}

return (
<div style={styles.cardGrid}>
{trip.hotels.map((hotel, index) => (
<div key={index} style={styles.premiumCard}>
<div style={styles.cardTopRow}>
<div style={styles.cardTopMeta}>🏨 {hotel.city || "Ville"}</div>
<span style={styles.priceChip}>{hotel.priceRange || "Tarif non précisé"}</span>
</div>

<div style={styles.cardTitleLg}>{hotel.name || "Hôtel"}</div>
<div style={styles.subMeta}>
{hotel.type || "Hébergement"} {hotel.stars ? `• ${"★".repeat(hotel.stars)}` : ""}
</div>

<p style={styles.cardText}>
{hotel.description || "Description non disponible."}
</p>

<a
href={buildGoogleMapsLink(
`${hotel.name || "hotel"} ${hotel.city || trip?.destination || destination}`
)}
target="_blank"
rel="noopener noreferrer"
style={styles.linkButton}
>
Voir sur Google Maps ↗
</a>
</div>
))}
</div>
);
}

function renderWeather() {
if (!trip?.weather) {
return <EmptyBlock text="Aucune météo disponible." />;
}

return (
<div style={styles.grid2}>
<InfoCard
title="Aperçu météo"
value={trip.weather.summary || "Non disponible"}
icon="🌤️"
/>
<InfoCard
title="Températures"
value={trip.weather.temperatureRange || "Non disponible"}
icon="🌡️"
/>
<InfoCard
title="Conseils"
value={trip.weather.tips || "Non disponible"}
icon="🧳"
/>
</div>
);
}

function renderFlights() {
if (!trip) return null;

const origin = trip?.flightOrigin || departureCity || "PAR";
const dest = trip?.flightDest || destination || "";

return (
<div style={styles.grid2}>
<div style={styles.premiumCard}>
<div style={styles.cardTopMeta}>✈️ Trajet</div>
<div style={styles.cardTitleLg}>{origin} → {dest}</div>
<p style={styles.cardText}>
Compare les options de vol et ouvre directement les recherches sur les plateformes utiles.
</p>

<div style={styles.actionsRow}>
<a
href={buildSkyscannerLink()}
target="_blank"
rel="noopener noreferrer"
style={styles.linkButton}
>
Skyscanner ↗
</a>

<a
href={buildGoogleFlightsLink()}
target="_blank"
rel="noopener noreferrer"
style={styles.secondaryButton}
>
Google Flights ↗
</a>
</div>
</div>

<div style={styles.premiumCard}>
<div style={styles.cardTopMeta}>💡 Conseil</div>
<div style={styles.cardTitleLg}>Réserver intelligemment</div>
<p style={styles.cardText}>
Compare toujours plusieurs horaires, vérifie les bagages inclus et regarde les départs en semaine pour des tarifs souvent plus intéressants.
</p>
</div>
</div>
);
}

function renderMap() {
if (!trip) return null;

const city = trip.destination || destination;
const cityStops = (trip.cities || []).filter(Boolean);

return (
<div style={{ display: "grid", gap: 16 }}>
<div style={styles.grid2}>
<LinkCard
title="Destination"
text="Ouvre directement la destination sur Google Maps."
icon="📍"
href={buildGoogleMapsLink(city)}
button="Ouvrir la destination ↗"
/>
<LinkCard
title="Hôtels"
text="Voir rapidement les hébergements sur la carte."
icon="🏨"
href={buildGoogleMapsLink(`hotels in ${city}`)}
button="Voir les hôtels ↗"
/>
<LinkCard
title="Restaurants"
text="Voir les restaurants et les zones les plus animées."
icon="🍽️"
href={buildGoogleMapsLink(`restaurants in ${city}`)}
button="Voir les restaurants ↗"
/>
</div>

{cityStops.length ? (
<div style={styles.premiumCard}>
<div style={styles.cardTopMeta}>🧭 Étapes du voyage</div>
<div style={styles.tagsWrap}>
{cityStops.map((stop, index) => (
<a
key={index}
href={buildGoogleMapsLink(stop)}
target="_blank"
rel="noopener noreferrer"
style={styles.mapChip}
>
{stop}
</a>
))}
</div>
</div>
) : null}
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
case "flights":
return renderFlights();
case "map":
return renderMap();
case "overview":
return renderOverview();
case "itinerary":
default:
return renderItinerary();
}
}

return (
<div style={styles.page}>
<style>{`
* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; }
body {
background: #09090d;
color: #f4f1ea;
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
button, input, select { font: inherit; }
a { text-decoration: none; }
`}</style>

<div style={styles.bgGlowOne} />
<div style={styles.bgGlowTwo} />

<div style={styles.shell}>
<header style={styles.header}>
<div>
<div style={styles.logo}>VOYAGEIA</div>
<h1 style={styles.heroTitle}>Ton guide de voyage premium, généré par IA</h1>
<p style={styles.heroText}>
Itinéraire élégant, hôtels, restaurants, vols, carte et infos pratiques dans une seule expérience.
</p>
</div>

<div style={styles.headerBadge}>
{trip
? `${trip.destination || destination} · ${trip.duration || durationDays} jours`
: "Guide haut de gamme"}
</div>
</header>

<section style={styles.formCard}>
<div style={styles.formGrid}>
<Field label="Destination">
<input
type="text"
placeholder="Ex: Tokyo, Rome, Bali, New York"
value={destination}
onChange={(e) => setDestination(e.target.value)}
style={styles.input}
/>
</Field>

<Field label="Ville de départ">
<input
type="text"
value={departureCity}
onChange={(e) => setDepartureCity(e.target.value)}
style={styles.input}
/>
</Field>

<Field label="Durée">
<input
type="number"
min="1"
max="30"
value={durationDays}
onChange={(e) => setDurationDays(e.target.value)}
style={styles.input}
/>
</Field>

<Field label="Voyageurs">
<input
type="number"
min="1"
max="10"
value={travelers}
onChange={(e) => setTravelers(e.target.value)}
style={styles.input}
/>
</Field>

<Field label="Budget">
<select value={budgetLevel} onChange={(e) => setBudgetLevel(e.target.value)} style={styles.input}>
<option value="budget">Budget</option>
<option value="confort">Confort</option>
<option value="luxe">Luxe</option>
</select>
</Field>

<Field label="Style">
<select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} style={styles.input}>
<option value="mix">Mix</option>
<option value="aventure">Aventure</option>
<option value="detente">Détente</option>
<option value="roadtrip">Road trip</option>
<option value="culture">Culture</option>
<option value="romantique">Romantique</option>
</select>
</Field>

<Field label="Type de voyage">
<select value={tripType} onChange={(e) => setTripType(e.target.value)} style={styles.input}>
<option value="couple">Couple</option>
<option value="solo">Solo</option>
<option value="amis">Amis</option>
<option value="famille">Famille</option>
</select>
</Field>

<Field label="Mois">
<input
type="text"
placeholder="Ex: Octobre"
value={month}
onChange={(e) => setMonth(e.target.value)}
style={styles.input}
/>
</Field>

<Field label="Langue">
<select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.input}>
<option value="fr">Français</option>
<option value="en">English</option>
</select>
</Field>
</div>

<div style={styles.formFooter}>
<button
onClick={handleGenerate}
disabled={loading}
style={{
...styles.primaryButton,
opacity: loading ? 0.75 : 1,
cursor: loading ? "wait" : "pointer"
}}
>
{loading ? "Génération en cours..." : "Générer mon guide"}
</button>

<div style={styles.formHint}>
Un guide plus beau, plus concret, plus vendable.
</div>
</div>
</section>

{error ? <div style={styles.errorBox}>{error}</div> : null}

{!trip && !loading ? (
<section style={styles.emptyHero}>
<div style={styles.emptyHeroTitle}>Choisis une destination et lance la génération</div>
<div style={styles.emptyHeroText}>
Exemple : Tokyo, Lisbonne, Concarneau, Bali, Rome.
</div>
</section>
) : null}

{trip ? (
<>
<section style={styles.tripHero}>
<div>
<div style={styles.tripEyebrow}>{trip.country || "Guide premium"}</div>
<h2 style={styles.tripTitle}>{trip.destination || destination}</h2>
<p style={styles.tripSummary}>{trip.summary || "Résumé non disponible."}</p>
</div>

<div style={styles.tripMetaBox}>
<MetaLine label="Durée" value={`${trip.duration || durationDays} jours`} />
<MetaLine label="Voyageurs" value={`${trip.travelers || travelers}`} />
<MetaLine label="Budget" value={trip.budget || budgetLevel} />
<MetaLine label="Période" value={trip.bestPeriod || "Non précisée"} />
<MetaLine label="Estimation" value={estimateBudget()} />
</div>
</section>

<nav style={styles.tabs}>
{tabs.map((tab) => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
style={{
...styles.tabButton,
...(activeTab === tab.id ? styles.tabButtonActive : {})
}}
>
<span>{tab.icon}</span>
<span>{tab.label}</span>
</button>
))}
</nav>

<section style={styles.contentCard}>{renderTab()}</section>
</>
) : null}
</div>
</div>
);
}

function Field({ label, children }) {
return (
<div style={styles.fieldWrap}>
<div style={styles.fieldLabel}>{label}</div>
{children}
</div>
);
}

function TimeCard({ label, text }) {
return (
<div style={styles.timeCard}>
<div style={styles.timeLabel}>{label}</div>
<div style={styles.timeText}>{text || "Non précisé."}</div>
</div>
);
}

function InfoCard({ title, value, icon }) {
return (
<div style={styles.infoCard}>
<div style={styles.cardTopMeta}>
{icon} {title}
</div>
<div style={styles.cardText}>{value}</div>
</div>
);
}

function LinkCard({ title, text, icon, href, button }) {
return (
<div style={styles.premiumCard}>
<div style={styles.cardTopMeta}>{icon} {title}</div>
<div style={styles.cardTitleLg}>{title}</div>
<p style={styles.cardText}>{text}</p>
<a href={href} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>
{button}
</a>
</div>
);
}

function StatCard({ label, value }) {
return (
<div style={styles.statCard}>
<div style={styles.statLabel}>{label}</div>
<div style={styles.statValue}>{value}</div>
</div>
);
}

function MetaLine({ label, value }) {
return (
<div style={styles.metaLine}>
<span style={styles.metaLabel}>{label}</span>
<span style={styles.metaValue}>{value}</span>
</div>
);
}

function EmptyBlock({ text }) {
return <div style={styles.emptyBlock}>{text}</div>;
}

const styles = {
page: {
minHeight: "100vh",
background:
"radial-gradient(circle at top left, rgba(220,180,90,0.12), transparent 25%), linear-gradient(180deg, #09090d 0%, #111118 100%)",
color: "#f4f1ea",
position: "relative",
overflow: "hidden"
},
bgGlowOne: {
position: "absolute",
width: 420,
height: 420,
borderRadius: "50%",
background: "rgba(201,168,76,0.12)",
filter: "blur(80px)",
top: -120,
left: -80,
pointerEvents: "none"
},
bgGlowTwo: {
position: "absolute",
width: 360,
height: 360,
borderRadius: "50%",
background: "rgba(120,90,200,0.10)",
filter: "blur(90px)",
bottom: -120,
right: -60,
pointerEvents: "none"
},
shell: {
maxWidth: 1200,
margin: "0 auto",
padding: "32px 20px 60px",
position: "relative",
zIndex: 2
},
header: {
display: "flex",
justifyContent: "space-between",
gap: 24,
alignItems: "flex-start",
marginBottom: 28,
flexWrap: "wrap"
},
logo: {
color: "#d8b76b",
fontSize: 14,
letterSpacing: "0.28em",
fontWeight: 700,
marginBottom: 14
},
heroTitle: {
fontSize: "clamp(34px, 5vw, 58px)",
lineHeight: 1.02,
margin: 0,
fontFamily: "Georgia, Times New Roman, serif",
fontWeight: 600,
maxWidth: 780
},
heroText: {
marginTop: 16,
color: "#b9b4a8",
fontSize: 16,
lineHeight: 1.7,
maxWidth: 760
},
headerBadge: {
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(216,183,107,0.18)",
padding: "12px 16px",
borderRadius: 14,
color: "#e7d8aa",
fontSize: 13,
whiteSpace: "nowrap"
},
formCard: {
background: "rgba(17,17,24,0.86)",
border: "1px solid rgba(216,183,107,0.12)",
borderRadius: 24,
padding: 22,
backdropFilter: "blur(10px)",
boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
},
formGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: 16
},
fieldWrap: {
display: "flex",
flexDirection: "column",
gap: 8
},
fieldLabel: {
fontSize: 12,
color: "#b6ae9d",
textTransform: "uppercase",
letterSpacing: "0.12em"
},
input: {
background: "#161620",
color: "#f5f2eb",
border: "1px solid rgba(216,183,107,0.16)",
borderRadius: 14,
padding: "14px 14px",
outline: "none",
fontSize: 15,
width: "100%"
},
formFooter: {
marginTop: 18,
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 16,
flexWrap: "wrap"
},
primaryButton: {
background: "linear-gradient(135deg, #d8b76b 0%, #f0d58b 100%)",
color: "#111118",
border: "none",
borderRadius: 14,
padding: "14px 22px",
fontWeight: 700,
fontSize: 15,
boxShadow: "0 10px 24px rgba(216,183,107,0.25)"
},
secondaryButton: {
background: "rgba(255,255,255,0.04)",
color: "#f4f1ea",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: 12,
padding: "12px 16px",
fontWeight: 600,
fontSize: 14
},
linkButton: {
marginTop: 14,
background: "linear-gradient(135deg, #d8b76b 0%, #f0d58b 100%)",
color: "#111118",
border: "none",
borderRadius: 12,
padding: "12px 16px",
fontWeight: 700,
fontSize: 14,
textDecoration: "none",
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
width: "fit-content"
},
formHint: {
color: "#a39b8b",
fontSize: 13
},
errorBox: {
marginTop: 18,
background: "rgba(210,70,70,0.10)",
color: "#ffb0b0",
border: "1px solid rgba(210,70,70,0.25)",
padding: "14px 16px",
borderRadius: 16
},
emptyHero: {
marginTop: 28,
padding: "42px 24px",
textAlign: "center",
color: "#b6ae9d"
},
emptyHeroTitle: {
fontSize: 22,
color: "#f4f1ea",
marginBottom: 10,
fontFamily: "Georgia, serif"
},
emptyHeroText: {
fontSize: 15
},
tripHero: {
marginTop: 28,
display: "grid",
gridTemplateColumns: "1.5fr 0.8fr",
gap: 18,
alignItems: "stretch"
},
tripEyebrow: {
color: "#d8b76b",
textTransform: "uppercase",
letterSpacing: "0.18em",
fontSize: 12,
marginBottom: 10
},
tripTitle: {
margin: 0,
fontSize: "clamp(30px, 4vw, 52px)",
fontFamily: "Georgia, serif",
lineHeight: 1.05
},
tripSummary: {
marginTop: 14,
color: "#c6c0b3",
fontSize: 16,
lineHeight: 1.8
},
tripMetaBox: {
background: "rgba(17,17,24,0.86)",
border: "1px solid rgba(216,183,107,0.12)",
borderRadius: 20,
padding: 20,
alignSelf: "start"
},
metaLine: {
display: "flex",
justifyContent: "space-between",
gap: 12,
padding: "10px 0",
borderBottom: "1px solid rgba(255,255,255,0.06)"
},
metaLabel: {
color: "#a7a091",
fontSize: 14
},
metaValue: {
color: "#f5f1e6",
fontWeight: 600,
textTransform: "capitalize",
textAlign: "right"
},
tabs: {
marginTop: 24,
display: "flex",
gap: 10,
flexWrap: "wrap"
},
tabButton: {
background: "rgba(255,255,255,0.04)",
color: "#cbc4b4",
border: "1px solid rgba(216,183,107,0.10)",
borderRadius: 999,
padding: "12px 16px",
display: "flex",
alignItems: "center",
gap: 8,
cursor: "pointer"
},
tabButtonActive: {
background: "linear-gradient(135deg, rgba(216,183,107,0.18), rgba(216,183,107,0.08))",
color: "#f5e2ad",
border: "1px solid rgba(216,183,107,0.28)"
},
contentCard: {
marginTop: 20,
background: "rgba(17,17,24,0.86)",
border: "1px solid rgba(216,183,107,0.12)",
borderRadius: 24,
padding: 22
},
heroInfoGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
gap: 12
},
statCard: {
background: "#161620",
border: "1px solid rgba(216,183,107,0.08)",
borderRadius: 18,
padding: 16
},
statLabel: {
color: "#bda96e",
fontSize: 12,
textTransform: "uppercase",
letterSpacing: "0.12em",
marginBottom: 8
},
statValue: {
color: "#f4f1ea",
fontWeight: 700,
fontSize: 18,
lineHeight: 1.4
},
dayCard: {
border: "1px solid rgba(216,183,107,0.10)",
borderRadius: 18,
background: "rgba(255,255,255,0.02)",
overflow: "hidden"
},
dayHeader: {
width: "100%",
background: "transparent",
border: "none",
color: "#f4f1ea",
padding: 18,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
cursor: "pointer",
textAlign: "left"
},
dayHeaderLeft: {
display: "flex",
gap: 16,
alignItems: "flex-start"
},
dayNumber: {
minWidth: 52,
height: 52,
borderRadius: 16,
background: "linear-gradient(135deg, #d8b76b 0%, #f0d58b 100%)",
color: "#111118",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 800,
fontSize: 18
},
dayCity: {
color: "#bda96e",
textTransform: "uppercase",
letterSpacing: "0.14em",
fontSize: 12,
marginBottom: 6
},
dayTitle: {
fontSize: 22,
fontFamily: "Georgia, serif",
marginBottom: 6
},
dayHighlight: {
color: "#c9c2b4",
fontSize: 14
},
chevron: {
fontSize: 26,
color: "#d8b76b",
paddingLeft: 12
},
dayBody: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: 14,
padding: "0 18px 18px"
},
timeCard: {
background: "#161620",
border: "1px solid rgba(216,183,107,0.08)",
borderRadius: 16,
padding: 16
},
timeLabel: {
color: "#d8b76b",
fontSize: 12,
textTransform: "uppercase",
letterSpacing: "0.14em",
marginBottom: 8
},
timeText: {
color: "#d7d1c4",
fontSize: 14,
lineHeight: 1.7
},
grid2: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: 14
},
cardGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 14
},
premiumCard: {
background: "#161620",
border: "1px solid rgba(216,183,107,0.08)",
borderRadius: 18,
padding: 18,
boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
},
infoCard: {
background: "#161620",
border: "1px solid rgba(216,183,107,0.08)",
borderRadius: 18,
padding: 18
},
cardTopRow: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 12,
marginBottom: 10
},
cardTopMeta: {
color: "#bda96e",
fontSize: 12,
textTransform: "uppercase",
letterSpacing: "0.12em",
marginBottom: 8
},
cardTitleLg: {
fontSize: 24,
fontFamily: "Georgia, serif",
marginBottom: 6
},
subMeta: {
color: "#9f9687",
fontSize: 14,
marginBottom: 12
},
sectionLine: {
marginBottom: 10
},
sectionLabel: {
display: "inline-block",
color: "#f3d27a",
fontSize: 12,
textTransform: "uppercase",
letterSpacing: "0.1em",
marginBottom: 6
},
cardText: {
color: "#d7d1c4",
lineHeight: 1.7,
fontSize: 14
},
priceChip: {
display: "inline-block",
background: "rgba(216,183,107,0.12)",
color: "#f3d27a",
borderRadius: 999,
padding: "6px 10px",
fontSize: 12,
whiteSpace: "nowrap"
},
tagsWrap: {
display: "flex",
flexWrap: "wrap",
gap: 8,
marginTop: 8
},
mapChip: {
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(216,183,107,0.10)",
borderRadius: 999,
padding: "8px 12px",
fontSize: 13,
color: "#f4f1ea",
textDecoration: "none"
},
smallMuted: {
color: "#a49c8c",
fontSize: 13,
lineHeight: 1.6
},
tipText: {
color: "#cfc7b7",
fontSize: 13,
lineHeight: 1.6,
marginTop: 8
},
actionsRow: {
display: "flex",
gap: 10,
flexWrap: "wrap",
marginTop: 12
},
emptyBlock: {
color: "#a49c8c",
padding: "18px 4px"
}
};

