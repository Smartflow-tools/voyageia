export async function generateTrip(payload) {

const response = await fetch("/.netlify/functions/generate-trip", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});

if (!response.ok) {
let message = "Erreur pendant la génération du guide.";

try {
const data = await response.json();
if (data?.error) message = data.error;
} catch (_) {}

throw new Error(message);
}

return response.json();
}
