export default function TripForm({ form, setForm, onSubmit, loading }) {
function updateField(key, value) {
setForm((prev) => ({ ...prev, [key]: value }));
}

function handleSubmit(e) {
e.preventDefault();
onSubmit();
}

return (
<form className="trip-form" onSubmit={handleSubmit}>
<div className="tf-grid">
<div className="tf-field">
<label>Destination</label>
<input
type="text"
value={form.destination}
onChange={(e) => updateField("destination", e.target.value)}
placeholder="Japon, Mexique, Islande..."
required
/>
</div>

<div className="tf-field">
<label>Ville de départ</label>
<input
type="text"
value={form.departureCity}
onChange={(e) => updateField("departureCity", e.target.value)}
placeholder="Paris"
required
/>
</div>

<div className="tf-field">
<label>Durée</label>
<input
type="number"
min="2"
max="30"
value={form.durationDays}
onChange={(e) => updateField("durationDays", Number(e.target.value))}
required
/>
</div>

<div className="tf-field">
<label>Voyageurs</label>
<input
type="number"
min="1"
max="10"
value={form.travelers}
onChange={(e) => updateField("travelers", Number(e.target.value))}
required
/>
</div>

<div className="tf-field">
<label>Budget</label>
<select
value={form.budgetLevel}
onChange={(e) => updateField("budgetLevel", e.target.value)}
>
<option value="budget">Budget</option>
<option value="confort">Confort</option>
<option value="premium">Premium</option>
</select>
</div>

<div className="tf-field">
<label>Style de voyage</label>
<select
value={form.travelStyle}
onChange={(e) => updateField("travelStyle", e.target.value)}
>
<option value="mix">Mix</option>
<option value="aventure">Aventure</option>
<option value="detente">Détente</option>
<option value="gastronomie">Gastronomie</option>
<option value="romantique">Romantique</option>
<option value="famille">Famille</option>
<option value="culture">Culture</option>
<option value="roadtrip">Road trip</option>
</select>
</div>

<div className="tf-field">
<label>Type de voyage</label>
<select
value={form.tripType}
onChange={(e) => updateField("tripType", e.target.value)}
>
<option value="solo">Solo</option>
<option value="couple">Couple</option>
<option value="friends">Amis</option>
<option value="family">Famille</option>
</select>
</div>

<div className="tf-field">
<label>Mois</label>
<input
type="text"
value={form.month}
onChange={(e) => updateField("month", e.target.value)}
placeholder="Avril"
required
/>
</div>

<div className="tf-field">
<label>Langue</label>
<select
value={form.language}
onChange={(e) => updateField("language", e.target.value)}
>
<option value="fr">Français</option>
<option value="en">English</option>
</select>
</div>
</div>

<div className="tf-actions">
<button type="submit" className="generate-btn" disabled={loading}>
{loading ? "Génération en cours..." : "Générer mon guide"}
</button>
</div>
</form>
);
}
