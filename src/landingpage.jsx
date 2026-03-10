import React from "react";

export default function LandingPage() {
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
a { text-decoration: none; color: inherit; }
`}</style>

<div style={styles.glow1} />
<div style={styles.glow2} />

<div style={styles.shell}>
<header style={styles.header}>
<div style={styles.logo}>VOYAGEIA</div>
<nav style={styles.nav}>
<a href="#features" style={styles.navLink}>Fonctionnalités</a>
<a href="#pricing" style={styles.navLink}>Tarifs</a>
<a href="/app" style={styles.navCta}>Essayer</a>
</nav>
</header>

<section style={styles.hero}>
<div style={styles.heroLeft}>
<div style={styles.eyebrow}>AI TRAVEL GUIDE</div>
<h1 style={styles.heroTitle}>
Planifie ton voyage
<br />
en 30 secondes
</h1>
<p style={styles.heroText}>
VoyageIA crée un guide premium avec itinéraire, restaurants,
hôtels, carte, vols et version PDF prête à emporter.
</p>

<div style={styles.heroButtons}>
<a href="/app" style={styles.primaryButton}>
Essayer gratuitement
</a>
<a href="#demo" style={styles.secondaryButton}>
Voir un exemple
</a>
</div>

<div style={styles.heroBadges}>
<span style={styles.badge}>Preview gratuit</span>
<span style={styles.badge}>Guide premium à 9 $</span>
<span style={styles.badge}>PDF téléchargeable</span>
</div>
</div>

<div style={styles.heroRight}>
<div style={styles.mockCard}>
<div style={styles.mockTop}>Exemple de guide</div>
<div style={styles.mockTitle}>Tokyo — 7 jours</div>
<div style={styles.mockMeta}>Couple • Confort • Avril</div>

<div style={styles.mockSection}>
<div style={styles.mockLabel}>Aperçu</div>
<p style={styles.mockText}>
Un mix parfait entre quartiers vibrants, temples paisibles,
food spots et hôtels bien situés.
</p>
</div>

<div style={styles.mockSection}>
<div style={styles.mockLabel}>Inclus</div>
<ul style={styles.mockList}>
<li>Itinéraire jour par jour</li>
<li>Restaurants sélectionnés</li>
<li>Hôtels recommandés</li>
<li>Carte + vols + PDF</li>
</ul>
</div>

<div style={styles.mockBottom}>
<span style={styles.mockChip}>Free preview</span>
<span style={styles.mockChipGold}>Unlock Premium — $9</span>
</div>
</div>
</div>
</section>

<section id="features" style={styles.section}>
<div style={styles.sectionHeader}>
<div style={styles.sectionEyebrow}>POURQUOI ÇA MARCHE</div>
<h2 style={styles.sectionTitle}>
Tout ce qu’il faut pour voyager,
<br />
dans un seul guide
</h2>
</div>

<div style={styles.featureGrid}>
<FeatureCard
icon="🗺️"
title="Itinéraire intelligent"
text="Un plan clair jour par jour, conçu selon ta destination, ton budget et ton style de voyage."
/>
<FeatureCard
icon="🍽️"
title="Restaurants utiles"
text="Des adresses concrètes à tester, directement intégrées au guide."
/>
<FeatureCard
icon="🏨"
title="Hôtels adaptés"
text="Des suggestions cohérentes avec ton niveau de confort et ton voyage."
/>
<FeatureCard
icon="✈️"
title="Vols et cartes"
text="Accès rapide à Google Maps, Skyscanner et Google Flights."
/>
<FeatureCard
icon="📄"
title="PDF premium"
text="Télécharge ton guide pour l’avoir avec toi pendant le voyage."
/>
<FeatureCard
icon="⚡"
title="Ultra rapide"
text="Plus besoin de passer des heures entre blogs, Booking, Reddit et YouTube."
/>
</div>
</section>

<section id="demo" style={styles.section}>
<div style={styles.sectionHeader}>
<div style={styles.sectionEyebrow}>COMMENT ÇA MARCHE</div>
<h2 style={styles.sectionTitle}>
De la destination au guide premium
</h2>
</div>

<div style={styles.stepsGrid}>
<StepCard
number="01"
title="Tu choisis une destination"
text="Ville de départ, durée, budget, style de voyage."
/>
<StepCard
number="02"
title="Tu obtiens un preview gratuit"
text="Résumé, aperçu du voyage, premières informations."
/>
<StepCard
number="03"
title="Tu débloques la version complète"
text="Guide complet + hôtels + restaurants + carte + PDF pour 9 $."
/>
</div>
</section>

<section id="pricing" style={styles.section}>
<div style={styles.sectionHeader}>
<div style={styles.sectionEyebrow}>TARIFS</div>
<h2 style={styles.sectionTitle}>Simple, clair, efficace</h2>
</div>

<div style={styles.pricingGrid}>
<div style={styles.pricingCard}>
<div style={styles.pricingPlan}>Preview gratuit</div>
<div style={styles.pricingPrice}>0 $</div>
<div style={styles.pricingDesc}>
Pour découvrir la destination avant achat.
</div>
<ul style={styles.pricingList}>
<li>Résumé du voyage</li>
<li>Meilleure période</li>
<li>Aperçu partiel</li>
<li>Découverte du produit</li>
</ul>
<a href="/app" style={styles.secondaryButtonFull}>
Tester gratuitement
</a>
</div>

<div style={styles.pricingCardFeatured}>
<div style={styles.bestValue}>MEILLEURE OFFRE</div>
<div style={styles.pricingPlan}>Guide premium</div>
<div style={styles.pricingPrice}>9 $</div>
<div style={styles.pricingDesc}>
Le guide complet prêt à utiliser.
</div>
<ul style={styles.pricingList}>
<li>Itinéraire complet</li>
<li>Restaurants et hôtels</li>
<li>Carte + liens utiles</li>
<li>PDF premium</li>
</ul>

<a
href="https://TON-STORE.lemonsqueezy.com/checkout/buy/TON_VARIANT_ID"
className="lemonsqueezy-button"
style={styles.primaryButtonFull}
>
Unlock Premium — 9 $
</a>
</div>
</div>
</section>

<section style={styles.ctaSection}>
<div style={styles.ctaCard}>
<div style={styles.sectionEyebrow}>PRÊT À TESTER ?</div>
<h2 style={styles.ctaTitle}>
Crée ton premier guide
<br />
aujourd’hui
</h2>
<p style={styles.ctaText}>
Lance un preview gratuit, puis débloque la version premium si le résultat te plaît.
</p>

<div style={styles.heroButtons}>
<a href="/app" style={styles.primaryButton}>
Commencer maintenant
</a>
<a
href="https://TON-STORE.lemonsqueezy.com/checkout/buy/TON_VARIANT_ID"
className="lemonsqueezy-button"
style={styles.secondaryButton}
>
Acheter à 9 $
</a>
</div>
</div>
</section>
</div>
</div>
);
}

function FeatureCard({ icon, title, text }) {
return (
<div style={styles.featureCard}>
<div style={styles.featureIcon}>{icon}</div>
<div style={styles.featureTitle}>{title}</div>
<div style={styles.featureText}>{text}</div>
</div>
);
}

function StepCard({ number, title, text }) {
return (
<div style={styles.stepCard}>
<div style={styles.stepNumber}>{number}</div>
<div style={styles.featureTitle}>{title}</div>
<div style={styles.featureText}>{text}</div>
</div>
);
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
glow1: {
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
glow2: {
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
padding: "28px 20px 72px",
position: "relative",
zIndex: 2
},
header: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 20,
flexWrap: "wrap"
},
logo: {
color: "#d8b76b",
fontSize: 14,
letterSpacing: "0.28em",
fontWeight: 700
},
nav: {
display: "flex",
gap: 14,
alignItems: "center",
flexWrap: "wrap"
},
navLink: {
color: "#c8c1b3",
fontSize: 14
},
navCta: {
background: "rgba(216,183,107,0.16)",
color: "#f5e2ad",
border: "1px solid rgba(216,183,107,0.28)",
borderRadius: 999,
padding: "10px 14px",
fontWeight: 600
},
hero: {
marginTop: 48,
display: "grid",
gridTemplateColumns: "1.2fr 0.9fr",
gap: 28,
alignItems: "center"
},
heroLeft: {},
heroRight: {
display: "flex",
justifyContent: "center"
},
eyebrow: {
color: "#d8b76b",
fontSize: 12,
letterSpacing: "0.18em",
textTransform: "uppercase",
marginBottom: 14
},
heroTitle: {
fontSize: "clamp(40px, 6vw, 72px)",
lineHeight: 0.98,
margin: 0,
fontFamily: "Georgia, serif",
fontWeight: 600
},
heroText: {
marginTop: 18,
color: "#b9b4a8",
fontSize: 18,
lineHeight: 1.7,
maxWidth: 680
},
heroButtons: {
display: "flex",
gap: 12,
marginTop: 24,
flexWrap: "wrap"
},
primaryButton: {
background: "linear-gradient(135deg, #d8b76b 0%, #f0d58b 100%)",
color: "#111118",
borderRadius: 14,
padding: "14px 20px",
fontWeight: 700
},
secondaryButton: {
background: "rgba(255,255,255,0.04)",
color: "#f4f1ea",
border: "1px solid rgba(255,255,255,0.10)",
borderRadius: 14,
padding: "14px 20px",
fontWeight: 600
},
heroBadges: {
display: "flex",
gap: 10,
flexWrap: "wrap",
marginTop: 18
},
badge: {
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(216,183,107,0.10)",
color: "#cfc7b7",
padding: "8px 12px",
borderRadius: 999,
fontSize: 13
},
mockCard: {
width: "100%",
maxWidth: 420,
background: "rgba(17,17,24,0.92)",
border: "1px solid rgba(216,183,107,0.12)",
borderRadius: 26,
padding: 24,
boxShadow: "0 20px 50px rgba(0,0,0,0.28)"
},
mockTop: {
color: "#d8b76b",
fontSize: 12,
letterSpacing: "0.14em",
textTransform: "uppercase",
marginBottom: 10
},
mockTitle: {
fontSize: 30,
fontFamily: "Georgia, serif",
marginBottom: 6
},
mockMeta: {
color: "#a7a091",
fontSize: 14,
marginBottom: 18
},
mockSection: {
marginTop: 14
},
mockLabel: {
color: "#f3d27a",
fontSize: 12,
textTransform: "uppercase",
letterSpacing: "0.12em",
marginBottom: 8
},
mockText: {
color: "#d7d1c4",
fontSize: 14,
lineHeight: 1.7
},
mockList: {
margin: 0,
paddingLeft: 18,
color: "#d7d1c4",
lineHeight: 1.8,
fontSize: 14
},
mockBottom: {
display: "flex",
gap: 10,
flexWrap: "wrap",
marginTop: 20
},
mockChip: {
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(255,255,255,0.10)",
borderRadius: 999,
padding: "8px 12px",
fontSize: 13,
color: "#d7d1c4"
},
mockChipGold: {
background: "rgba(216,183,107,0.14)",
border: "1px solid rgba(216,183,107,0.24)",
borderRadius: 999,
padding: "8px 12px",
fontSize: 13,
color: "#f5e2ad"
},
section: {
marginTop: 88
},
sectionHeader: {
marginBottom: 24
},
sectionEyebrow: {
color: "#d8b76b",
fontSize: 12,
letterSpacing: "0.18em",
textTransform: "uppercase",
marginBottom: 10
},
sectionTitle: {
margin: 0,
fontSize: "clamp(28px, 4vw, 44px)",
lineHeight: 1.08,
fontFamily: "Georgia, serif"
},
featureGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
gap: 16
},
featureCard: {
background: "#161620",
border: "1px solid rgba(216,183,107,0.08)",
borderRadius: 20,
padding: 20
},
featureIcon: {
fontSize: 24,
marginBottom: 12
},
featureTitle: {
fontSize: 20,
fontFamily: "Georgia, serif",
marginBottom: 8
},
featureText: {
color: "#b9b4a8",
fontSize: 14,
lineHeight: 1.7
},
stepsGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
gap: 16
},
stepCard: {
background: "#161620",
border: "1px solid rgba(216,183,107,0.08)",
borderRadius: 20,
padding: 20
},
stepNumber: {
color: "#f3d27a",
fontSize: 14,
fontWeight: 700,
letterSpacing: "0.12em",
marginBottom: 12
},
pricingGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 18
},
pricingCard: {
background: "#161620",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 24,
padding: 24
},
pricingCardFeatured: {
background: "linear-gradient(180deg, rgba(216,183,107,0.10), rgba(22,22,32,1))",
border: "1px solid rgba(216,183,107,0.22)",
borderRadius: 24,
padding: 24,
boxShadow: "0 20px 40px rgba(0,0,0,0.22)"
},
bestValue: {
display: "inline-block",
marginBottom: 12,
background: "rgba(216,183,107,0.16)",
border: "1px solid rgba(216,183,107,0.24)",
color: "#f5e2ad",
borderRadius: 999,
padding: "6px 10px",
fontSize: 12,
fontWeight: 700
},
pricingPlan: {
fontSize: 22,
fontFamily: "Georgia, serif",
marginBottom: 10
},
pricingPrice: {
fontSize: 40,
fontWeight: 800,
marginBottom: 8
},
pricingDesc: {
color: "#b9b4a8",
marginBottom: 16,
lineHeight: 1.6
},
pricingList: {
margin: 0,
paddingLeft: 18,
color: "#d7d1c4",
lineHeight: 1.9,
fontSize: 14,
marginBottom: 20
},
primaryButtonFull: {
display: "inline-flex",
width: "100%",
justifyContent: "center",
background: "linear-gradient(135deg, #d8b76b 0%, #f0d58b 100%)",
color: "#111118",
borderRadius: 14,
padding: "14px 18px",
fontWeight: 700
},
secondaryButtonFull: {
display: "inline-flex",
width: "100%",
justifyContent: "center",
background: "rgba(255,255,255,0.04)",
color: "#f4f1ea",
border: "1px solid rgba(255,255,255,0.10)",
borderRadius: 14,
padding: "14px 18px",
fontWeight: 600
},
ctaSection: {
marginTop: 88
},
ctaCard: {
background: "linear-gradient(180deg, rgba(216,183,107,0.08), rgba(17,17,24,0.96))",
border: "1px solid rgba(216,183,107,0.16)",
borderRadius: 28,
padding: 32,
textAlign: "center"
},
ctaTitle: {
margin: 0,
fontSize: "clamp(28px, 4vw, 44px)",
fontFamily: "Georgia, serif",
lineHeight: 1.1
},
ctaText: {
color: "#b9b4a8",
fontSize: 16,
lineHeight: 1.7,
maxWidth: 700,
margin: "16px auto 0"
}
};
