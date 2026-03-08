export async function generateTrip(payload) {
const response = await fetch("/.netlify/functions/generate-trip", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});

const data = await response.json().catch(() => ({}));

if (!response.ok) {
throw new Error(
data.error || data.details || data.raw || "Erreur pendant la génération du guide."
);
}

return data;
}

