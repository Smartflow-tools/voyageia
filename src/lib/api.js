export async function generateTrip(payload) {
const response = await fetch("/.netlify/functions/generate-trip", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});

const text = await response.text();

let data;
try {
data = JSON.parse(text);
} catch (e) {
throw new Error("Réponse serveur invalide");
}

if (!response.ok) {
throw new Error(
data.preview
? `${data.error}\n\n${data.preview}`
: data.error || data.details || data.raw || "Erreur pendant la génération du guide."
);
}

return data;
}


