import { useState } from "react";
import TripForm from "./components/TripForm";
import { generateTrip } from "./lib/api";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STATIC_TRIP = {
  destination: "Maroc", country: "Morocco", duration: 7,
  departureCity: "Paris", travelers: 2, style: "Nature, Plages & Soirées", budget: "Confort",
  summary: "Entre dunes dorées, vagues de l'Atlantique et nuits étoilées aux parfums de rose et de cannelle — le Maroc vous attend, vibrant et envoûtant.",
  bestPeriod: "Mars–Mai / Sept–Nov",
  cities: ["Marrakech", "Essaouira", "Agadir"],
  flightOrigin: "PAR", flightDest: "RAK",
  distanceKm: 2400,

  itinerary: [
    { day: 1, city: "Marrakech", title: "La Ville Rouge t'accueille", morning: "Atterrissage à l'aéroport Marrakech Menara. Check-in dans un riad traditionnel. Recommandé : Riad Yasmine (piscine turquoise) ou Riad BE Marrakech (design, calme).", afternoon: "Premier plongeon dans la Djemaa el-Fna : jus d'orange frais (4 DH), exploration des souks (cuirs, épices, babouches). Pause au café Argana pour observer la place.", evening: "Dîner au restaurant Nomad (cuisine marocaine moderne, terrasse avec vue) ou Le Jardin (cadre jardin suspendu). Ruelles illuminées après 21h.", highlight: "La Djemaa el-Fna au coucher du soleil : acrobates, conteurs, fumée des grillades" },
    { day: 2, city: "Marrakech", title: "Jardins & Palais", morning: "Jardin Majorelle dès 8h30 pour éviter la foule — bleu Majorelle, cactus centenaires, musée berbère (70 DH). Villa Oasis de Yves Saint Laurent juste à côté.", afternoon: "Palais Bahia (architecture andalouse) puis Mellah, l'ancien quartier juif. Hammam traditionnel : Les Bains de Marrakech, gommage complet (200–400 DH, réserver la veille).", evening: "Jemaa el-Fna version nocturne : 100 stands de cuisine populaire. Escargots épicés (5 DH), méchoui, brochettes. Verre au rooftop bar Kabana.", highlight: "Le hammam traditionnel : sortir avec la peau neuve, rituel millénaire" },
    { day: 3, city: "Essaouira", title: "Route vers la Cité des Vents", morning: "Départ Marrakech 8h en grand taxi (70 DH/pers, 2h30). Route traversant les arganiers — arrêt pour voir les chèvres perchées dans les arbres.", afternoon: "Médina UNESCO : remparts bleus et blancs, port de pêche aux barques bleues. Déjeuner au restaurant Chez Sam sur le port — poisson ultra-frais. Plage d'Essaouira : 5 km de sable.", evening: "Coucher de soleil depuis les remparts (Skala de la Ville). Dîner à la Tablée d'Essaouira. Nuit en maison d'hôtes bleue et blanche.", highlight: "Le port au coucher de soleil : mouettes, barques bleues, remparts orangés" },
    { day: 4, city: "Essaouira", title: "Plage, Vents & Liberté", morning: "Kitesurf ou windsurf — capitale mondiale du windsurf. Spot Moulay Bouzerktoun à 20 min au nord. École Ocean Vagabond (cours débutants 300–500 DH).", afternoon: "Plage de Sidi Kaouki (30 min) : plage sauvage quasi-déserte, marabout blanc, ambiance bout-du-monde. Galeries d'art de la médina (Jimmy Hendrix y séjourna).", evening: "Musique Gnaoua dans la médina — concert souvent gratuit. Bar Os Salons, musiciens locaux, thé à la menthe et pâtisseries.", highlight: "Sidi Kaouki : une plage sauvage où le temps s'arrête" },
    { day: 5, city: "Agadir", title: "Route côtière Atlantique", morning: "Départ Essaouira 9h, route côtière (2h30). Traversée de Tamri, flamants roses dans l'estuaire. Route longeant les falaises atlantiques.", afternoon: "Plage d'Agadir : 10 km de sable fin, mer calme, baignade parfaite. Farniente : parasol, cocktail de jus frais, bain de soleil sur la corniche.", evening: "Marina d'Agadir : fruits de mer, bars avec vue sur les bateaux. Dîner au Pure Passion (vue marina). Premier verre au Papagayo Beach Club.", highlight: "La plage d'Agadir au coucher du soleil : 10 km de sable, eaux calmes" },
    { day: 6, city: "Agadir", title: "Souss-Massa & Soirée de Feu", morning: "Parc National Souss-Massa (40 min au sud) : Ibis chauve, flamants roses, dunes côtières. Quad ou chameau sur les dunes (150–250 DH). Déjeuner fruits de mer.", afternoon: "Massage aux huiles d'argan dans un spa (l'argan vient de cette région). Option : Tiznit, cité de l'argent berbère, bijoutiers dans la médina.", evening: "Dîner-spectacle au restaurant Le Dôme : musique gnaoua live, danse du ventre. Club Papagayo ou Flamingo Club sur la corniche jusqu'à 4h.", highlight: "Le parc Souss-Massa à l'aube : flamants roses dans la brume, silence total" },
    { day: 7, city: "Agadir", title: "Les Dernières Saveurs", morning: "Souk El Had d'Agadir : safran de Taliouine (40 DH/g), huile d'argan (60–100 DH), savon beldi. Le plus grand souk du Maroc en superficie.", afternoon: "Déjeuner final face à la mer : tagine de poisson au chermoula, pastilla aux fruits de mer. Transfert aéroport Agadir Al Massira (30 min).", evening: "Dans l'avion, les yeux fermés : revoir les dunes, entendre les vagues d'Essaouira, sentir les épices des souks.", highlight: "Souk El Had : revenir avec du safran véritable, les vrais trésors du Maroc" },
  ],

  hotels: [
    { city: "Marrakech", name: "Riad Yasmine", type: "Riad", stars: 4, priceRange: "80–130€/nuit", description: "Piscine turquoise au cœur de la médina, petits-déjeuners sur terrasse, déco orientale chic.", bookingUrl: "https://www.booking.com/search.html?ss=Riad+Yasmine+Marrakech", tags: ["Piscine","Médina","Romantique"] },
    { city: "Marrakech", name: "Riad BE Marrakech", type: "Riad design", stars: 5, priceRange: "120–200€/nuit", description: "Design contemporain, calme absolu, hammam privé. Le meilleur rapport qualité/expérience.", bookingUrl: "https://www.booking.com/search.html?ss=Riad+BE+Marrakech", tags: ["Design","Hammam","Luxe"] },
    { city: "Essaouira", name: "Riad Zahra", type: "Maison d'hôtes", stars: 3, priceRange: "55–90€/nuit", description: "Bleu et blanc, vue sur les remparts, toit-terrasse avec l'océan à l'horizon.", bookingUrl: "https://www.booking.com/search.html?ss=Riad+Essaouira+medina", tags: ["Vue océan","Charme","Authentique"] },
    { city: "Agadir", name: "Sofitel Agadir Royal Bay", type: "Resort", stars: 5, priceRange: "150–280€/nuit", description: "Plage privée, spa thalasso, piscines infinies face à l'Atlantique.", bookingUrl: "https://www.booking.com/search.html?ss=Sofitel+Agadir+Royal+Bay", tags: ["Plage privée","Spa","Piscine"] },
    { city: "Agadir", name: "Riu Palace Tikida Agadir", type: "Hôtel balnéaire", stars: 4, priceRange: "90–160€/nuit", description: "Bord de mer, tout-inclus possible, idéal familles et farniente.", bookingUrl: "https://www.booking.com/search.html?ss=Riu+Palace+Tikida+Agadir", tags: ["Bord de mer","Tout inclus","Famille"] },
  ],

  restaurants: [
    { city: "Marrakech", name: "Nomad", cuisine: "Marocaine moderne", price: "€€", must: "Bastilla croustillante au pigeon", address: "1 Derb Arset Aouzal, Médina", tip: "Réserver la terrasse du dernier étage, vue sur les toits.", bookingUrl: "https://www.thefork.com/restaurant/nomad-marrakech" },
    { city: "Marrakech", name: "Le Jardin", cuisine: "Méditerranéenne", price: "€€", must: "Pastilla aux légumes et amandes", address: "32 Souk El Jeld, Sidi Abdelaziz", tip: "Tables dans le jardin intérieur, ombragé et calme même en été." },
    { city: "Marrakech", name: "Jemaa el-Fna stands", cuisine: "Street food", price: "€", must: "Méchoui n°14, escargots épicés", address: "Place Jemaa el-Fna, le soir", tip: "Aller vers 20h, choisir les stands les plus fréquentés par les locaux." },
    { city: "Essaouira", name: "Chez Sam", cuisine: "Fruits de mer", price: "€€", must: "Crevettes grillées à l'ail", address: "Port de pêche d'Essaouira", tip: "La salle dans la coque du bateau, arriver à l'ouverture pour le poisson du jour." },
    { city: "Essaouira", name: "La Tablée d'Essaouira", cuisine: "Marocaine", price: "€€", must: "Tagine d'agneau aux pruneaux", address: "Médina, près des remparts", tip: "Idéal après le coucher de soleil sur les remparts." },
    { city: "Agadir", name: "Pure Passion", cuisine: "Fruits de mer & grill", price: "€€€", must: "Homard grillé et sauce chermoula", address: "Marina d'Agadir", tip: "Demander la table en terrasse face aux bateaux, préférable en soirée." },
    { city: "Agadir", name: "Le Miramar", cuisine: "Marocaine traditionnelle", price: "€€", must: "Couscous royal du vendredi", address: "Rue des FAR, Agadir", tip: "Le vendredi midi pour le couscous royal — réserver absolument." },
  ],

  health: {
    vaccines: [
      { name: "Hépatite A", required: false, recommended: true, note: "Fortement recommandé, transmission via eau/aliments" },
      { name: "Typhoïde", required: false, recommended: true, note: "Recommandé surtout si sortie des circuits touristiques" },
      { name: "Hépatite B", required: false, recommended: true, note: "Si contact médical possible ou séjour long" },
      { name: "Tétanos-Polio-Diphtérie", required: false, recommended: true, note: "Mise à jour recommandée tous les 10 ans" },
      { name: "Covid-19", required: false, recommended: true, note: "Pas d'obligation mais recommandé" },
    ],
    pharmacies: [
      { city: "Marrakech", name: "Pharmacie de Nuit", address: "Rue Khalid Ben Oualid, Guéliz", phone: "+212 524 43 01 15", hours: "24h/24" },
      { city: "Essaouira", name: "Pharmacie El Wifak", address: "Avenue de l'Istiqlal", phone: "+212 524 47 52 10", hours: "8h–20h" },
      { city: "Agadir", name: "Pharmacie de Garde Agadir", address: "Avenue Mohammed V", phone: "+212 528 84 29 00", hours: "24h/24" },
    ],
    hospitals: [
      { city: "Marrakech", name: "Clinique Internationale Marrakech", phone: "+212 524 33 40 40", type: "Privée (recommandée touristes)" },
      { city: "Agadir", name: "Clinique Argana", phone: "+212 528 84 10 03", type: "Privée" },
    ],
    tips: [
      "Ne jamais boire l'eau du robinet — eau en bouteille ou filtrée uniquement",
      "Éviter les crudités et fruits non pelés dans les petits restaurants",
      "Crème solaire SPF50 minimum, renouveler toutes les 2h",
      "Consulter votre médecin 4–6 semaines avant le départ pour les vaccins",
      "Emporter une trousse : Imodium, Doliprane, désinfectant, pansements, thermomètre",
      "Assurance voyage avec rapatriement médical OBLIGATOIRE — soins privés très chers",
    ],
  },

  carbon: {
    flightCO2: 1.2, // tonnes par pers (Paris-Marrakech A/R)
    localTransportCO2: 0.08,
    accommodationCO2: 0.14,
    totalPerPerson: 1.42,
    equivalences: [
      { label: "mois de chauffage d'un appartement", value: 4 },
      { label: "km en voiture diesel", value: 7100 },
      { label: "repas avec bœuf", value: 142 },
    ],
    offsets: [
      { name: "Gold Standard", url: "https://www.goldstandard.org", price: "~14€/tonne", description: "Projets certifiés énergies renouvelables en Afrique" },
      { name: "Atmosfair", url: "https://www.atmosfair.de", price: "~21€/tonne", description: "Référence européenne, projets vérifiés" },
      { name: "Good Planet", url: "https://www.goodplanet.org", price: "~15€/tonne", description: "ONG française, forêts et accès à l'énergie propre" },
    ],
  },

  family: {
    suitable: true,
    minAge: 3,
    activities: [
      { name: "Jardins de la Menara", city: "Marrakech", ageMin: 0, description: "Grands espaces verts, bassin, idéal pour pique-niquer avec enfants" },
      { name: "Karting Agadir", city: "Agadir", ageMin: 7, description: "Circuit karting à 10 min du centre, dès 7 ans" },
      { name: "Dromadaire sur la plage", city: "Agadir", ageMin: 3, description: "Balade dromadaire sur la plage au coucher du soleil — inoubliable" },
      { name: "Aquapark Agadir", city: "Agadir", ageMin: 3, description: "Parc aquatique à 5 min de la plage, toboggans et bassins enfants" },
      { name: "Musée Berbère (Majorelle)", city: "Marrakech", ageMin: 8, description: "Collection fascinante, accessible et pédagogique" },
    ],
    strollerAccessibility: "Médinas peu accessibles poussette (pavés, ruelles étroites). Agadir corniche et plage excellent. Essaouira difficile.",
    familyHotels: ["Riu Palace Tikida Agadir (club enfants, piscine)", "Sofitel Agadir (plage sécurisée, animations)"],
    tips: [
      "Emporter poussette légère pliable pour les médinas",
      "Mouchoirs humides et désinfectant en permanence dans le sac",
      "Chapeau et crème SPF50 enfants obligatoires dès 9h",
      "Les enfants sont adorés au Maroc — pas de stress social",
      "Prévoir siestes longues — les soirées se terminent tard",
      "Eau en bouteille uniquement, même pour brosser les dents des enfants",
    ],
  },

  practicalInfo: {
    visa: { icon: "🛂", label: "Visa", value: "Passeport français/belge/canadien : entrée libre sans visa jusqu'à 90 jours. Passeport valide 6 mois minimum." },
    currency: { icon: "💰", label: "Monnaie", value: "Dirham marocain (MAD). 1€ ≈ 11 DH. Cash privilégié dans les souks. ATM partout (commission 3–5 DH)." },
    language: { icon: "🗣️", label: "Langue", value: "Arabe dialectal (darija) et français parlés partout. Le français suffit dans toutes les zones touristiques." },
    transport: { icon: "🚌", label: "Transport", value: "Grand taxi intercité (70 DH/pers). Location voiture recommandée (30–50€/jour). Apps Careem et inDrive à Marrakech/Agadir." },
    safety: { icon: "🛡️", label: "Sécurité", value: "Très sûr pour les touristes. Prudence normale dans les médinas. Dire fermement 'La, shukran' aux vendeurs insistants." },
    health: { icon: "💊", label: "Santé", value: "Hépatite A et typhoïde recommandés. Ne pas boire l'eau du robinet. Crème solaire SPF50 indispensable." },
    electricity: { icon: "🔌", label: "Électricité", value: "Prises type C et E (Europe). 220V. Pas d'adaptateur nécessaire pour appareils européens." },
    emergency: { icon: "🆘", label: "Urgences", value: "Police : 19 | SAMU : 15 | Ambassade FR Rabat : +212 537 68 97 00 | Clinique Internationale Marrakech : +212 524 33 40 40" },
  },

  checklist: {
    documents: { icon: "📋", label: "Documents", items: ["Passeport valide 6 mois min", "Assurance voyage avec rapatriement", "Réservations hôtels imprimées ou screenshot", "Carte bancaire internationale"] },
    clothing: { icon: "👕", label: "Vêtements", items: ["Vêtements légers respirants (lin, coton)", "Coupe-vent léger pour Essaouira", "Maillots de bain x2", "Chaussures de marche confortables", "Tenue couvrant épaules/genoux pour médinas"] },
    health: { icon: "💊", label: "Santé", items: ["Crème solaire SPF50 grande taille", "Anti-diarrhéique (Imodium)", "Répulsif moustiques", "Médicaments personnels suffisants"] },
    tech: { icon: "📱", label: "Tech", items: ["Adaptateur prise (type C/E, inutile si EU)", "Chargeur portable/powerbank", "Carte SIM locale optionnelle (Maroc Telecom, 30 DH)"] },
    misc: { icon: "🎒", label: "Divers", items: ["Sac à dos léger pour excursions", "Lunettes de soleil qualité", "Petite lampe torche (ruelles médina)", "Cash dirhams (retrait ATM sur place)"] },
  },

  photoSpots: [
    { city: "Marrakech", spot: "Djemaa el-Fna depuis les terrasses", time: "Coucher de soleil 18h–19h", tip: "Monter au café Argana ou Les Terrasses de l'Alhambra pour la vue plongeante sur la place" },
    { city: "Marrakech", spot: "Jardin Majorelle", time: "Ouverture 8h30 — lumière dorée", tip: "Arriver à l'ouverture, avant la foule. Angle idéal : fontaine bleue avec cactus au premier plan" },
    { city: "Essaouira", spot: "Skala de la Ville (remparts)", time: "Coucher de soleil 19h–20h", tip: "Position nord des remparts pour avoir l'océan + les canons portugais dans le même cadre" },
    { city: "Agadir", spot: "Plage d'Agadir vue depuis la Kasbah", time: "Coucher de soleil 19h30–20h30", tip: "Monter à la Kasbah d'Agadir (colline) pour la vue panoramique sur les 10 km de plage" },
    { city: "Agadir", spot: "Parc Souss-Massa — flamants roses", time: "Aube 6h–8h", tip: "Arriver à l'ouverture, lumière dorée sur les flamants. Longue focale recommandée." },
  ],

  phrasebook: [
    { fr: "Bonjour", local: "Salam / Labas", phonetic: "sa-LAM / la-BAS", category: "essentiel" },
    { fr: "Merci", local: "Shukran", phonetic: "CHUK-ran", category: "essentiel" },
    { fr: "Oui / Non", local: "Ih / La", phonetic: "ih / la", category: "essentiel" },
    { fr: "Combien ça coûte ?", local: "Bchhal hada ?", phonetic: "b-CHAL ha-DA", category: "shopping" },
    { fr: "C'est trop cher", local: "Ghali bezzaf", phonetic: "GHA-li be-ZAF", category: "shopping" },
    { fr: "Non merci, je regarde", local: "La shukran, kancher", phonetic: "la CHUK-ran, kan-CHER", category: "shopping" },
    { fr: "Où sont les toilettes ?", local: "Fayn l'toilette ?", phonetic: "FAYN el-twa-LET", category: "pratique" },
    { fr: "L'addition, s'il vous plaît", local: "L'factura, afak", phonetic: "el-fak-TU-ra, a-FAK", category: "restaurant" },
    { fr: "Sans viande", local: "Bla l'ham", phonetic: "bla el-HAM", category: "restaurant" },
    { fr: "À droite / À gauche", local: "L'imen / L'isar", phonetic: "el-i-MEN / el-i-SAR", category: "direction" },
    { fr: "Appelez la police !", local: "Ayyet l'police !", phonetic: "a-YET el-po-LEES", category: "urgence" },
  ],

  reminders: [
    { timing: "J−30", tasks: ["Vérifier validité passeport (6 mois min)", "Souscrire assurance voyage avec rapatriement", "Réserver vols si pas encore fait", "Réserver riads/hôtels (haute saison = complet tôt)"] },
    { timing: "J−14", tasks: ["Consulter médecin pour vaccins (Hépatite A, typhoïde)", "Commander dirhams marocains en banque (meilleur taux)", "Télécharger cartes offline (Maps.me ou Google Maps offline)", "Vérifier conditions d'entrée actuelles (ambassade.ma)"] },
    { timing: "J−7", tasks: ["Préparer photocopies passeport + assurance", "Installer apps utiles : Careem (taxi), Google Translate (arabe), XE (devises)", "Confirmer toutes les réservations par email", "Prévenir votre banque du voyage (éviter blocage carte)"] },
    { timing: "J−1", tasks: ["Check-in en ligne si possible", "Charger tous les appareils électroniques", "Imprimer ou sauvegarder offline : billets, réservations, numéros d'urgence", "Préparer le sac à main cabine : documents, médicaments, vêtements de rechange"] },
    { timing: "Jour J", tasks: ["Arriver à l'aéroport 2h30 à l'avance minimum", "Retrait de dirhams à l'ATM à l'arrivée (meilleur taux qu'au bureau de change)", "Négocier le taxi AVANT de monter : Marrakech centre = 80–100 DH depuis l'aéroport", "Sauvegarder le numéro de votre riad / hôtel dans votre téléphone"] },
  ],

  budgetItems: [
    { category: "Vols", icon: "✈️", low: 180, mid: 280, high: 450, unit: "€/pers A/R", note: "Paris–Marrakech ou Paris–Agadir" },
    { category: "Hébergement", icon: "🏨", low: 45, mid: 90, high: 180, unit: "€/nuit (2 pers)", note: "Riad médina / Hôtel balnéaire" },
    { category: "Repas", icon: "🍽️", low: 20, mid: 40, high: 70, unit: "€/jour (2 pers)", note: "Petits restos à restaurants gastro" },
    { category: "Transport local", icon: "🚕", low: 8, mid: 20, high: 40, unit: "€/jour", note: "Taxis + grand taxi intercité" },
    { category: "Activités", icon: "🏄", low: 10, mid: 30, high: 60, unit: "€/jour", note: "Entrées + hammam + sports" },
    { category: "Shopping / Souvenirs", icon: "🛍️", low: 30, mid: 80, high: 200, unit: "€ total voyage", note: "Épices, argan, artisanat" },
  ],
};

let TRIP =STATIC_TRIP;

const CLIMATE = {
  Marrakech: {
    months: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"],
    hi:   [18,20,24,27,31,37,40,39,33,27,22,18],
    lo:   [ 5, 7,10,13,16,20,23,23,19,14, 9, 6],
    rain: [25,20,30,25,15, 5, 2, 3,10,20,30,25],
    sun:  [ 7, 8, 9,10,11,12,12,12,10, 9, 7, 6],
    icon: ["🌤️","🌤️","☀️","☀️","☀️","🌞","🌞","🌞","☀️","🌤️","🌤️","🌤️"],
    tips: ["Froid le soir, journées douces — prévoir une veste","Idéal pour visiter la médina, peu de touristes","Printemps parfait, fleurs d'amandiers","Excellent — chaleur agréable, peu de pluie","Chaud mais supportable","Très chaud — visiter tôt le matin","Canicule 40°C+ — éviter midi–17h","Encore très chaud","Agréable — températures idéales","Parfait — températures douces","Bon moment — frais le soir","Froid en soirée — ambiance Noël des souks"],
  },
  Essaouira: {
    months: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"],
    hi:   [17,18,20,21,22,23,24,25,24,22,19,17],
    lo:   [10,11,13,14,16,18,19,19,18,16,13,11],
    rain: [40,35,30,20,10, 3, 1, 2, 8,25,45,45],
    sun:  [ 6, 7, 8, 9,10,10,10,10, 9, 8, 6, 5],
    icon: ["⛅","🌤️","🌤️","☀️","☀️","☀️","☀️","☀️","☀️","🌤️","⛅","⛅"],
    tips: ["Vent fort — parfait windsurf pro","Doux mais venteux","Printemps agréable","Excellent — températures idéales","Brume matinale","Saison kitesurf","Haute saison windsurf","Festival Gnaoua","Vents diminuent — idéal familles","Très agréable — mer plus calme","Quelques pluies — charme hors saison","Hiver doux — médina intime"],
  },
  Agadir: {
    months: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"],
    hi:   [20,21,23,24,25,27,28,29,28,26,23,21],
    lo:   [10,11,13,14,16,18,20,21,19,16,13,11],
    rain: [20,15,15,10, 5, 1, 0, 0, 5,15,25,25],
    sun:  [ 8, 9, 9,10,11,12,12,12,10, 9, 8, 7],
    icon: ["☀️","☀️","☀️","☀️","☀️","🌞","🌞","🌞","☀️","☀️","🌤️","🌤️"],
    tips: ["Doux — parfait pour Européens en hiver","Excellent","Idéal — températures agréables","Très bon — mer se réchauffe","Parfait — chaleur douce","Haute saison balnéaire","12h de soleil — baignade parfaite","Pic de l'été — brise atlantique rafraîchit","Fin saison — mer chaude moins de monde","Très agréable","Doux — randonnées Anti-Atlas","Hiver ensoleillé"],
  },
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#C9A84C;--gold2:#E8C97A;--gold-d:rgba(201,168,76,.13);--gold-d2:rgba(201,168,76,.06);
  --ink:#08080E;--ink2:#10101A;--ink3:#181826;--ink4:#222234;--ink5:#2C2C42;
  --txt:#EAE6DE;--muted:#7C7870;--soft:#B8B4AC;
  --border:rgba(201,168,76,.16);--border2:rgba(201,168,76,.08);
  --green:#4caf78;--green-d:rgba(76,175,120,.12);
  --blue:#5b9bd5;--blue-d:rgba(91,155,213,.12);
  --r:3px;
}
html{scroll-behavior:smooth}
body{margin:0}
.app{font-family:'Outfit',sans-serif;background:var(--ink);color:var(--txt);min-height:100vh;overflow-x:hidden}

/* PRINT MODE */
@media print{
  .hdr,.nav,.no-print,.print-hide{display:none!important}
  .app{background:#fff!important;color:#000!important}
  body{background:#fff}
  *{color:#000!important;border-color:#ddd!important;background:transparent!important}
  .main{max-width:100%;padding:0!important}
  .day-card,.info-card,.cl-grp,.spot-card,.phrase-card,.hotel-card,.rest-card{
    background:#fafafa!important;border:1px solid #ddd!important;page-break-inside:avoid;margin-bottom:8px!important}
  .day-body{grid-template-columns:1fr!important}
  .day-chev{display:none}
  .time-block{border-right:none!important;border-bottom:1px solid #ddd!important}
}

.print-mode .app{background:#f8f6f0!important;color:#1a1a1a!important}
.print-mode *{--ink:#f8f6f0;--ink2:#ffffff;--ink3:#f0ede4;--ink4:#e8e4d8;--txt:#1a1a1a;--muted:#666;--soft:#444;--border:rgba(0,0,0,.12);--border2:rgba(0,0,0,.06)}

/* HEADER */
.hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 36px;border-bottom:1px solid var(--border);background:rgba(8,8,14,.92);backdrop-filter:blur(16px);position:sticky;top:0;z-index:200}
.logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:400;letter-spacing:3px;color:var(--gold);text-transform:uppercase;cursor:pointer;user-select:none}
.logo em{color:var(--txt);font-style:normal}
.hdr-trip{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.hdr-actions{display:flex;gap:8px}
.hdr-btn{padding:7px 14px;background:var(--gold-d);border:1px solid var(--border);color:var(--gold);cursor:pointer;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-radius:var(--r);font-family:'Outfit',sans-serif;transition:all .2s;white-space:nowrap}
.hdr-btn:hover{background:rgba(201,168,76,.25)}
.hdr-btn.active{background:var(--gold);color:var(--ink)}

/* HERO */
.hero{padding:44px 36px 32px;max-width:1000px;margin:0 auto}
.hero-dest{font-family:'Playfair Display',serif;font-size:clamp(52px,7vw,80px);font-weight:400;font-style:italic;color:var(--gold);line-height:1;margin-bottom:14px;animation:fadeUp .6s both}
.hero-sum{font-size:14px;font-weight:300;line-height:1.8;color:var(--muted);max-width:580px;margin-bottom:22px;animation:fadeUp .6s .1s both}
.chips{display:flex;flex-wrap:wrap;gap:8px;animation:fadeUp .6s .2s both}
.chip{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);border:1px solid var(--border);padding:5px 12px;border-radius:var(--r)}

/* NAV */
.nav{display:flex;border-bottom:1px solid var(--border);padding:0 36px;overflow-x:auto;background:var(--ink2);position:sticky;top:57px;z-index:100}
.nav::-webkit-scrollbar{height:2px}.nav::-webkit-scrollbar-thumb{background:var(--gold-d)}
.ntab{padding:14px 18px;background:transparent;border:none;border-bottom:2px solid transparent;color:var(--muted);cursor:pointer;font-size:11.5px;letter-spacing:.5px;white-space:nowrap;transition:all .25s;margin-bottom:-1px;font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:5px}
.ntab.on{border-bottom-color:var(--gold);color:var(--gold)}.ntab:hover:not(.on){color:var(--txt)}

/* MAIN */
.main{max-width:1000px;margin:0 auto;padding:32px 36px 80px}
.section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;font-style:italic;color:var(--gold);margin-bottom:20px}

/* DAY CARDS */
.day-card{border:1px solid var(--border);background:var(--ink2);margin-bottom:10px;border-radius:var(--r);overflow:hidden;transition:border-color .25s}
.day-card:hover{border-color:rgba(201,168,76,.35)}
.day-hdr{display:flex;align-items:center;padding:18px 22px;cursor:pointer;gap:18px;user-select:none}
.day-num{font-family:'Playfair Display',serif;font-size:40px;font-weight:400;color:var(--gold);min-width:52px;line-height:1}
.day-info{flex:1}.day-city{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
.day-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:400;line-height:1.3}
.day-hl{font-size:12px;color:var(--gold);font-style:italic;margin-top:4px;opacity:.85}
.day-chev{color:var(--muted);font-size:10px;transition:transform .3s;flex-shrink:0}
.day-chev.open{transform:rotate(180deg)}
.day-body{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--border2)}
.time-block{padding:18px 20px;border-right:1px solid var(--border2)}
.time-block:last-child{border-right:none}
.time-lbl{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:7px}
.time-txt{font-size:12.5px;line-height:1.7;color:var(--soft)}

/* HOTELS */
.hotel-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.hotel-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:18px;display:flex;flex-direction:column;gap:8px}
.hotel-city{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.hotel-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:400;line-height:1.2}
.hotel-stars{color:var(--gold);font-size:12px}
.hotel-type{font-size:11px;color:var(--muted);font-style:italic}
.hotel-price{font-size:13px;font-weight:500;color:var(--gold)}
.hotel-desc{font-size:12px;line-height:1.65;color:var(--soft)}
.hotel-tags{display:flex;flex-wrap:wrap;gap:5px}
.htag{font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border:1px solid var(--border);color:var(--muted);border-radius:2px}
.hotel-link{display:inline-block;padding:8px 14px;background:var(--gold-d);border:1px solid var(--border);color:var(--gold);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-radius:var(--r);transition:all .2s;margin-top:auto;text-align:center}
.hotel-link:hover{background:rgba(201,168,76,.25)}

/* RESTAURANTS */
.rest-city-grp{margin-bottom:24px}
.rest-city-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border2)}
.rest-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.rest-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:16px}
.rest-name{font-size:15px;font-weight:500;margin-bottom:3px}
.rest-meta{display:flex;gap:10px;align-items:center;margin-bottom:6px}
.rest-cuisine{font-size:11px;color:var(--muted)}
.rest-price{font-size:12px;color:var(--gold);font-weight:500}
.rest-must{font-size:12px;color:var(--soft);margin-bottom:5px}
.rest-must strong{color:var(--gold)}
.rest-tip{font-size:11.5px;line-height:1.6;color:var(--muted);border-left:2px solid var(--gold-d);padding-left:8px;font-style:italic}

/* FLIGHTS */
.flight-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r);padding:24px;margin-bottom:12px}
.flight-route{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.flight-city{font-family:'Playfair Display',serif;font-size:28px;color:var(--gold)}
.flight-arrow{flex:1;height:1px;background:var(--border);position:relative;margin:0 8px}
.flight-arrow::after{content:"✈";position:absolute;top:-10px;right:-4px;font-size:16px;color:var(--gold)}
.flight-links{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.flink{display:flex;flex-direction:column;align-items:center;padding:14px;background:var(--ink3);border:1px solid var(--border2);border-radius:var(--r);text-decoration:none;transition:border-color .2s;gap:4px}
.flink:hover{border-color:var(--gold)}
.flink-logo{font-size:20px}
.flink-name{font-size:11px;font-weight:500;color:var(--txt)}
.flink-desc{font-size:10px;color:var(--muted);text-align:center}

/* HEALTH */
.health-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.vaccine-list{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:18px}
.vax-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--border2)}
.vax-item:last-child{border-bottom:none}
.vax-badge{padding:3px 7px;font-size:9px;letter-spacing:1px;text-transform:uppercase;border-radius:2px;flex-shrink:0;margin-top:2px}
.vax-rec{background:var(--green-d);color:var(--green);border:1px solid rgba(76,175,120,.2)}
.vax-name{font-size:13px;font-weight:500;margin-bottom:2px}
.vax-note{font-size:11.5px;color:var(--muted);line-height:1.5}
.pharmacy-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:16px}
.ph-city{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.ph-name{font-size:14px;font-weight:500;margin-bottom:3px}
.ph-detail{font-size:12px;color:var(--muted);line-height:1.6}

/* CARBON */
.carbon-hero{background:linear-gradient(135deg,var(--green-d),var(--ink3));border:1px solid rgba(76,175,120,.2);border-radius:var(--r);padding:24px;margin-bottom:16px;display:flex;gap:24px;align-items:center}
.carbon-num{font-family:'Playfair Display',serif;font-size:52px;color:var(--green);line-height:1}
.carbon-unit{font-size:12px;color:var(--muted);margin-top:4px}
.carbon-eq{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.ceq{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:14px;text-align:center}
.ceq-val{font-family:'Playfair Display',serif;font-size:22px;color:var(--gold);margin-bottom:4px}
.ceq-lbl{font-size:11px;color:var(--muted);line-height:1.4}
.offset-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.offset-card{background:var(--ink2);border:1px solid rgba(76,175,120,.15);border-radius:var(--r);padding:14px}
.offset-name{font-size:14px;font-weight:500;margin-bottom:3px;color:var(--green)}
.offset-price{font-size:12px;color:var(--gold);margin-bottom:4px}
.offset-desc{font-size:11px;color:var(--muted);line-height:1.5;margin-bottom:8px}
.offset-link{font-size:11px;color:var(--green);text-decoration:none}
.offset-link:hover{text-decoration:underline}

/* FAMILY */
.family-banner{background:var(--blue-d);border:1px solid rgba(91,155,213,.2);border-radius:var(--r);padding:18px 22px;margin-bottom:16px;display:flex;gap:14px;align-items:center}
.fam-activities{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.fam-act{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:14px}
.fam-city{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-bottom:4px}
.fam-name{font-size:14px;font-weight:500;margin-bottom:3px}
.fam-age{font-size:11px;color:var(--gold);margin-bottom:4px}
.fam-desc{font-size:12px;color:var(--muted);line-height:1.5}

/* WEATHER */
.wx-month-selector{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:20px}
.wx-mbtn{padding:6px 11px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;font-size:11px;letter-spacing:.5px;transition:all .2s;border-radius:var(--r);font-family:'Outfit',sans-serif}
.wx-mbtn.on{border-color:var(--gold);background:var(--gold-d);color:var(--gold)}
.wx-cities{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.wx-city-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r);padding:18px}
.wx-city-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.wx-city-main{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.wx-city-icon{font-size:32px}
.wx-city-temp{font-family:'Playfair Display',serif;font-size:30px;color:var(--gold);line-height:1}
.wx-city-lo{font-size:12px;color:var(--muted)}
.wx-city-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.wx-stat{background:var(--ink3);border-radius:2px;padding:7px 9px;text-align:center}
.wx-stat-val{font-size:13px;font-weight:500}
.wx-stat-lbl{font-size:9px;color:var(--muted)}
.wx-city-tip{font-size:11.5px;color:var(--soft);line-height:1.6;font-style:italic;border-left:2px solid var(--gold-d);padding-left:8px}
.wx-annual{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:20px}
.wx-bars{display:flex;gap:4px;align-items:flex-end;height:60px;margin-top:10px}

/* BUDGET */
.budget-controls{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.bctrl{display:flex;flex-direction:column;gap:6px}
.bctrl label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.bctrl select,.bctrl input{background:var(--ink3);border:1px solid var(--border);color:var(--txt);padding:9px 14px;font-family:'Outfit',sans-serif;font-size:13px;border-radius:var(--r);outline:none;transition:border-color .25s;min-width:120px}
.bctrl select:focus,.bctrl input:focus{border-color:var(--gold)}
.budget-table{width:100%;border-collapse:collapse;margin-bottom:20px}
.budget-table th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);padding:10px 14px;text-align:left;border-bottom:1px solid var(--border)}
.budget-table td{padding:12px 14px;border-bottom:1px solid var(--border2);font-size:13px;vertical-align:top}
.budget-table tr:hover td{background:var(--ink3)}
.b-cat{display:flex;align-items:center;gap:8px;font-weight:500}
.b-note{font-size:11px;color:var(--muted);margin-top:2px}
.b-amt{font-family:'Playfair Display',serif;font-size:16px;color:var(--gold)}
.budget-total{background:linear-gradient(135deg,var(--ink3),var(--ink4));border:1px solid var(--border);border-radius:var(--r);padding:22px 24px;display:flex;justify-content:space-between;align-items:center}
.bt-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.bt-amount{font-family:'Playfair Display',serif;font-size:36px;font-weight:400;color:var(--gold)}
.bt-note{font-size:12px;color:var(--soft);margin-top:2px}

/* SHARED UTILS */
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.info-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:18px}
.info-icon{font-size:20px;margin-bottom:7px}
.info-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
.info-val{font-size:12.5px;line-height:1.65;color:var(--txt)}
.cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cl-grp{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:18px}
.cl-grp-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
.cl-item{display:flex;align-items:flex-start;gap:9px;padding:6px 0;cursor:pointer;border-bottom:1px solid var(--border2)}
.cl-item:last-child{border-bottom:none}
.cb{width:15px;height:15px;border:1px solid var(--border);border-radius:2px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:9px;transition:all .2s;background:var(--ink4)}
.cb.on{background:var(--gold-d);border-color:var(--gold);color:var(--gold)}
.cl-lbl{font-size:12.5px;color:var(--soft);line-height:1.5}.cl-lbl.done{text-decoration:line-through;opacity:.4}
.spots-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.spot-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:18px}
.spot-city{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.spot-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:400;margin-bottom:6px}
.spot-time{font-size:11px;color:var(--muted);margin-bottom:8px}
.spot-tip{font-size:12px;line-height:1.6;color:var(--soft);border-left:2px solid var(--gold-d);padding-left:10px}
.phrase-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.pf-btn{padding:6px 12px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;font-size:11px;letter-spacing:1px;text-transform:uppercase;transition:all .25s;border-radius:var(--r);font-family:'Outfit',sans-serif}
.pf-btn.on{border-color:var(--gold);background:var(--gold-d);color:var(--gold)}
.phrases-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.phrase-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:14px 16px}
.ph-fr{font-size:11px;color:var(--muted);margin-bottom:4px}
.ph-local{font-size:16px;font-weight:500;margin-bottom:3px}
.ph-phonetic{font-size:11px;color:var(--gold);font-style:italic}
.reminders-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.reminder-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:16px}
.rem-timing{font-family:'Playfair Display',serif;font-size:22px;color:var(--gold);margin-bottom:10px}
.rem-task{display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-size:12px;line-height:1.5;color:var(--soft);cursor:pointer;border-bottom:1px solid var(--border2)}
.rem-task:last-child{border-bottom:none}
.rem-cb{width:14px;height:14px;border:1px solid var(--border);border-radius:2px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:8px;background:var(--ink4)}
.rem-cb.on{background:var(--gold-d);border-color:var(--gold);color:var(--gold)}
.rem-txt.done{text-decoration:line-through;opacity:.4}
.notes-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.note-card{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:16px}
.note-day{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
.note-title{font-size:13px;font-weight:500;margin-bottom:8px;color:var(--soft)}
.note-input{width:100%;background:var(--ink3);border:1px solid var(--border2);color:var(--txt);padding:10px;font-family:'Outfit',sans-serif;font-size:12px;border-radius:2px;outline:none;resize:vertical;min-height:72px;transition:border-color .25s;line-height:1.5}
.note-input:focus{border-color:var(--gold)}.note-input::placeholder{color:var(--muted);opacity:.5}
.map-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:16px}
.map-header{padding:18px 22px;border-bottom:1px solid var(--border2)}
.map-cities{display:flex;gap:10px;flex-wrap:wrap;padding:18px 22px}
.map-city{background:var(--ink3);border:1px solid var(--border);border-radius:var(--r);padding:10px 16px}
.mc-name{font-size:13px;font-weight:500;margin-bottom:2px}
.mc-days{font-size:11px;color:var(--muted)}
.mc-icon{font-size:20px;margin-bottom:4px}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:680px){
  .hdr,.nav,.main,.hero{padding-left:18px;padding-right:18px}
  .day-body,.hotel-grid,.rest-grid,.health-grid,.fam-activities,.carbon-eq,.offset-grid,.info-grid,.cl-grid,.notes-grid,.spots-grid,.phrases-grid,.wx-cities,.flight-links{grid-template-columns:1fr}
  .time-block{border-right:none;border-bottom:1px solid var(--border2)}.time-block:last-child{border-bottom:none}
  .carbon-hero{flex-direction:column}
  .reminders-grid{grid-template-columns:1fr 1fr}
  .hdr-trip{display:none}
}
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function DayCard({ day }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="day-card">
      <div className="day-hdr" onClick={() => setOpen(o => !o)}>
        <div className="day-num">{String(day.day).padStart(2,"0")}</div>
        <div className="day-info">
          <div className="day-city">{day.city}</div>
          <div className="day-title">{day.title}</div>
          {day.highlight && <div className="day-hl">✦ {day.highlight}</div>}
        </div>
        <div className={`day-chev${open?" open":""}`}>▼</div>
      </div>
      {open && (
        <div className="day-body">
          {[["☀","Matin",day.morning],["◑","Après-midi",day.afternoon],["☽","Soirée",day.evening]].map(([ic,lb,tx])=>(
            <div className="time-block" key={lb}>
              <div className="time-lbl">{ic} {lb}</div>
              <div className="time-txt">{tx}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HotelsTab() {
  const cities = [...new Set(TRIP.hotels.map(h => h.city))];
  return (
    <div>
      {cities.map(city => (
        <div key={city} style={{marginBottom:28}}>
          <div style={{fontSize:10,letterSpacing:"3px",textTransform:"uppercase",color:"var(--gold)",marginBottom:14,paddingBottom:6,borderBottom:"1px solid var(--border2)"}}>
            📍 {city}
          </div>
          <div className="hotel-grid">
            {TRIP.hotels.filter(h => h.city === city).map(h => (
              <div className="hotel-card" key={h.name}>
                <div className="hotel-city">{h.type}</div>
                <div className="hotel-name">{h.name}</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div className="hotel-stars">{"★".repeat(h.stars)}</div>
                  <div className="hotel-price">{h.priceRange}</div>
                </div>
                <div className="hotel-desc">{h.description}</div>
                <div className="hotel-tags">{h.tags.map(t=><span key={t} className="htag">{t}</span>)}</div>
                <a href={h.bookingUrl} target="_blank" className="hotel-link">Voir sur Booking.com ↗</a>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"14px 18px",fontSize:12,color:"var(--soft)",lineHeight:1.6}}>
        <strong style={{color:"var(--gold)"}}>💡 Conseil réservation</strong> — Pour les riads de Marrakech et Essaouira, réserver au moins 2–3 mois à l'avance en haute saison (mars–mai, sept–oct). Agadir est plus flexible. Toujours lire les avis récents sur la propreté et le bruit.
      </div>
    </div>
  );
}

function RestaurantsTab() {
  const cities = [...new Set(TRIP.restaurants.map(r => r.city))];
  return (
    <div>
      {cities.map(city => (
        <div className="rest-city-grp" key={city}>
          <div className="rest-city-label">📍 {city}</div>
          <div className="rest-grid">
            {TRIP.restaurants.filter(r => r.city === city).map(r => (
              <div className="rest-card" key={r.name}>
                <div className="rest-name">{r.name}</div>
                <div className="rest-meta">
                  <span className="rest-cuisine">{r.cuisine}</span>
                  <span className="rest-price">{r.price}</span>
                </div>
                <div className="rest-must"><strong>✦ À commander :</strong> {r.must}</div>
                {r.address && <div style={{fontSize:11,color:"var(--muted)",marginBottom:5}}>📍 {r.address}</div>}
                <div className="rest-tip">{r.tip}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlightsTab() {
  const skyscannerUrl = `https://www.skyscanner.fr/transport/vols/${TRIP.flightOrigin}/${TRIP.flightDest}/`;
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=Vols+${TRIP.departureCity}+${TRIP.destination}`;
  const kayakUrl = `https://www.kayak.fr/flights/${TRIP.flightOrigin}-${TRIP.flightDest}`;
  return (
    <div>
      <div className="flight-card">
        <div className="flight-route">
          <div className="flight-city">{TRIP.departureCity}</div>
          <div className="flight-arrow"></div>
          <div className="flight-city">{TRIP.destination}</div>
        </div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:18}}>
          Vol direct ~3h30 · Compagnies : Royal Air Maroc, Air Arabia Maroc, Transavia, easyJet · Meilleur prix : 2–3 mois à l'avance
        </div>
        <div className="flight-links">
          {[
            {logo:"🔵",name:"Skyscanner",desc:"Comparateur — meilleur prix garanti",url:skyscannerUrl},
            {logo:"🟡",name:"Google Flights",desc:"Alerte prix + prévision tendance",url:googleFlightsUrl},
            {logo:"🔶",name:"Kayak",desc:"Flexibilité dates ±3 jours",url:kayakUrl},
          ].map(s=>(
            <a key={s.name} href={s.url} target="_blank" className="flink">
              <span className="flink-logo">{s.logo}</span>
              <span className="flink-name">{s.name}</span>
              <span className="flink-desc">{s.desc}</span>
            </a>
          ))}
        </div>
      </div>
      <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"16px 20px"}}>
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--gold)",marginBottom:10}}>🎯 Astuces pour trouver moins cher</div>
        {["Rechercher en navigation privée — les prix ne montent pas avec vos visites répétées","Mardi et mercredi = jours les moins chers pour partir","Activer les alertes prix sur Google Flights pour votre période","Comparer aéroport de départ alternatif (Lyon, Bruxelles, Genève) — souvent -30%","Vols directs vs correspondance : direct vaut souvent le surcoût côté confort"].map((tip,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--border2)",fontSize:12,color:"var(--soft)",lineHeight:1.5}}>
            <span style={{color:"var(--gold)",flexShrink:0}}>✦</span>{tip}
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthTab() {
  return (
    <div>
      <div style={{background:"rgba(76,175,120,.06)",border:"1px solid rgba(76,175,120,.2)",borderRadius:"var(--r)",padding:"14px 18px",marginBottom:20,fontSize:12,color:"var(--soft)",lineHeight:1.6}}>
        <strong style={{color:"var(--green)"}}>⚕️ Important</strong> — Consulter votre médecin ou un centre de vaccination au moins <strong style={{color:"var(--txt)"}}>4–6 semaines avant le départ</strong> pour les vaccins et les recommandations personnalisées selon votre état de santé.
      </div>

      <div className="health-grid">
        <div className="vaccine-list">
          <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Vaccins recommandés</div>
          {TRIP.health.vaccines.map(v => (
            <div className="vax-item" key={v.name}>
              <span className={`vax-badge ${v.recommended?"vax-rec":""}`}>{v.recommended?"Recommandé":"Optionnel"}</span>
              <div>
                <div className="vax-name">{v.name}</div>
                <div className="vax-note">{v.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Pharmacies & Hôpitaux</div>
          {[...TRIP.health.pharmacies, ...TRIP.health.hospitals.map(h=>({...h,name:h.name,address:h.type,hours:h.phone}))].map((p,i)=>(
            <div className="pharmacy-card" key={i} style={{marginBottom:8}}>
              <div className="ph-city">{p.city}</div>
              <div className="ph-name">{p.name}</div>
              <div className="ph-detail">{p.address && <span>📍 {p.address}<br/></span>}📞 {p.phone || p.hours}{p.hours && p.phone ? <span> · {p.hours}</span> : ""}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"18px 20px"}}>
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>💊 Conseils santé essentiels</div>
        {TRIP.health.tips.map((tip,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--border2)",fontSize:12,color:"var(--soft)",lineHeight:1.5}}>
            <span style={{color:"var(--green)",flexShrink:0}}>✦</span>{tip}
          </div>
        ))}
      </div>
    </div>
  );
}

function CarbonTab() {
  const c = TRIP.carbon;
  const total = c.totalPerPerson * TRIP.travelers;
  const offsetCost = Math.round(total * 21);
  return (
    <div>
      <div className="carbon-hero">
        <div>
          <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--green)",marginBottom:6}}>🌍 Empreinte carbone estimée</div>
          <div className="carbon-num">{c.totalPerPerson}</div>
          <div className="carbon-unit">tonnes CO₂ par personne · {total} tonnes total ({TRIP.travelers} pers.)</div>
        </div>
        <div style={{flex:1,fontSize:12,color:"var(--soft)",lineHeight:1.7}}>
          <strong style={{color:"var(--txt)",display:"block",marginBottom:6}}>Répartition</strong>
          {[["✈️ Vol A/R",`${c.flightCO2}t — ${Math.round(c.flightCO2/c.totalPerPerson*100)}% du total`],["🚕 Transport local",`${c.localTransportCO2}t`],["🏨 Hébergement",`${c.accommodationCO2}t`]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid var(--border2)"}}><span>{k}</span><span style={{color:"var(--gold)"}}>{v}</span></div>
          ))}
        </div>
      </div>

      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>📊 Équivalences — {c.totalPerPerson}t CO₂, c'est comme…</div>
      <div className="carbon-eq">
        {c.equivalences.map(eq=>(
          <div className="ceq" key={eq.label}>
            <div className="ceq-val">{eq.value}</div>
            <div className="ceq-lbl">{eq.label}</div>
          </div>
        ))}
      </div>

      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>♻️ Compenser — coût estimé ≈ {offsetCost}€ pour {TRIP.travelers} pers.</div>
      <div className="offset-grid">
        {c.offsets.map(o=>(
          <div className="offset-card" key={o.name}>
            <div className="offset-name">{o.name}</div>
            <div className="offset-price">{o.price}</div>
            <div className="offset-desc">{o.description}</div>
            <a href={o.url} target="_blank" className="offset-link">Compenser ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function FamilyTab() {
  const f = TRIP.family;
  return (
    <div>
      <div className="family-banner">
        <span style={{fontSize:36}}>👨‍👩‍👧</span>
        <div>
          <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>Ce voyage est adapté aux familles avec enfants dès {f.minAge} ans</div>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>{f.strollerAccessibility}</div>
        </div>
      </div>

      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>🎡 Activités enfants</div>
      <div className="fam-activities">
        {f.activities.map(a=>(
          <div className="fam-act" key={a.name}>
            <div className="fam-city">{a.city}</div>
            <div className="fam-name">{a.name}</div>
            <div className="fam-age">À partir de {a.ageMin} ans</div>
            <div className="fam-desc">{a.description}</div>
          </div>
        ))}
      </div>

      <div style={{background:"var(--ink2)",border:"1px solid var(--blue-d)",borderRadius:"var(--r)",padding:"18px 20px",marginBottom:14}}>
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--blue)",marginBottom:10}}>🏨 Hôtels recommandés familles</div>
        {f.familyHotels.map((h,i)=><div key={i} style={{padding:"6px 0",borderBottom:"1px solid var(--border2)",fontSize:12,color:"var(--soft)"}}>✦ {h}</div>)}
      </div>

      <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"18px 20px"}}>
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--gold)",marginBottom:10}}>💡 Conseils voyage en famille</div>
        {f.tips.map((tip,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--border2)",fontSize:12,color:"var(--soft)",lineHeight:1.5}}>
            <span style={{color:"var(--blue)",flexShrink:0}}>✦</span>{tip}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeatherTab() {
  const [selMonth, setSelMonth] = useState(new Date().getMonth());
  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Choisir le mois de voyage</div>
        <div className="wx-month-selector">
          {CLIMATE.Marrakech.months.map((m,i)=>(
            <button key={m} className={`wx-mbtn${selMonth===i?" on":""}`} onClick={()=>setSelMonth(i)}>{m}</button>
          ))}
        </div>
      </div>
      <div className="wx-cities">
        {Object.entries(CLIMATE).map(([city,c])=>(
          <div className="wx-city-card" key={city}>
            <div className="wx-city-lbl">📍 {city}</div>
            <div className="wx-city-main">
              <span className="wx-city-icon">{c.icon[selMonth]}</span>
              <div>
                <div className="wx-city-temp">{c.hi[selMonth]}°</div>
                <div className="wx-city-lo">min {c.lo[selMonth]}°</div>
              </div>
            </div>
            <div className="wx-city-stats">
              <div className="wx-stat"><div className="wx-stat-val">💧{c.rain[selMonth]}mm</div><div className="wx-stat-lbl">pluie</div></div>
              <div className="wx-stat"><div className="wx-stat-val">☀️{c.sun[selMonth]}h</div><div className="wx-stat-lbl">soleil/j</div></div>
            </div>
            <div className="wx-city-tip">{c.tips[selMonth]}</div>
          </div>
        ))}
      </div>
      <div className="wx-annual">
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)"}}>Vue annuelle — Marrakech</div>
        <div className="wx-bars">
          {CLIMATE.Marrakech.hi.map((hi,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{fontSize:9,color:selMonth===i?"var(--gold)":"var(--muted)"}}>{hi}°</div>
              <div style={{width:"100%",background:selMonth===i?"var(--gold)":"var(--ink4)",borderRadius:2,height:`${Math.round((hi/40)*44)}px`,border:selMonth===i?"none":"1px solid var(--border2)"}}/>
              <div style={{fontSize:8,color:selMonth===i?"var(--gold)":"var(--muted)"}}>{CLIMATE.Marrakech.months[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BudgetTab() {
  const [nights, setNights] = useState(7);
  const [level, setLevel] = useState(1);
  const [trav, setTrav] = useState(2);
  const keys = ["low","mid","high"];
  const lk = keys[level];
  const rows = TRIP.budgetItems.map(item => {
    let val = item[lk];
    if(["Hébergement","Repas","Transport local","Activités"].includes(item.category)) val *= nights;
    else if(item.category === "Vols") val *= trav;
    return { ...item, computed: val };
  });
  const total = rows.reduce((s,r)=>s+r.computed,0);
  return (
    <div>
      <div className="budget-controls">
        {[["Budget",<select value={level} onChange={e=>setLevel(+e.target.value)}>{["Économique","Confort","Luxe"].map((l,i)=><option key={l} value={i}>{l}</option>)}</select>],["Nuits",<input type="number" min="1" max="30" value={nights} onChange={e=>setNights(+e.target.value)} style={{width:80}}/>],["Voyageurs",<input type="number" min="1" max="10" value={trav} onChange={e=>setTrav(+e.target.value)} style={{width:80}}/>]].map(([label,el])=>(
          <div className="bctrl" key={label}><label>{label}</label>{el}</div>
        ))}
      </div>
      <table className="budget-table">
        <thead><tr><th>Catégorie</th><th>Base</th><th>Total estimé</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.category}>
              <td><div className="b-cat">{r.icon} {r.category}</div><div className="b-note">{r.note}</div></td>
              <td style={{fontSize:11,color:"var(--muted)"}}>{r.unit}</td>
              <td><div className="b-amt">≈ {r.computed}€</div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="budget-total">
        <div>
          <div className="bt-label">Total — {trav} pers. / {nights} nuits</div>
          <div className="bt-amount">{total.toLocaleString("fr-FR")} €</div>
          <div className="bt-note">≈ {Math.round(total/trav).toLocaleString("fr-FR")} € par personne</div>
        </div>
        <span style={{fontSize:32}}>🧮</span>
      </div>
    </div>
  );
}

function ChecklistTab() {
  const [checked, setChecked] = useState({});
  const toggle = (k,i) => setChecked(c=>({...c,[`${k}-${i}`]:!c[`${k}-${i}`]}));
  return (
    <div className="cl-grid">
      {Object.entries(TRIP.checklist).map(([k,grp])=>(
        <div className="cl-grp" key={k}>
          <div className="cl-grp-title">{grp.icon} {grp.label}</div>
          {grp.items.map((item,i)=>{
            const done=!!checked[`${k}-${i}`];
            return(<div className="cl-item" key={i} onClick={()=>toggle(k,i)}><div className={`cb${done?" on":""}`}>{done?"✓":""}</div><span className={`cl-lbl${done?" done":""}`}>{item}</span></div>);
          })}
        </div>
      ))}
    </div>
  );
}

function PhrasebookTab() {
  const cats = ["tous","essentiel","shopping","restaurant","pratique","direction","urgence"];
  const [cat, setCat] = useState("tous");
  const filtered = cat==="tous" ? TRIP.phrasebook : TRIP.phrasebook.filter(p=>p.category===cat);
  return (
    <div>
      <div className="phrase-filter">
        {cats.map(c=><button key={c} className={`pf-btn${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>)}
      </div>
      <div className="phrases-grid">
        {filtered.map((p,i)=>(
          <div className="phrase-card" key={i}>
            <div className="ph-fr">{p.fr}</div>
            <div className="ph-local">{p.local}</div>
            <div className="ph-phonetic">/{p.phonetic}/</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RemindersTab() {
  const [checked, setChecked] = useState({});
  const toggle = (ri,ti) => setChecked(c=>({...c,[`${ri}-${ti}`]:!c[`${ri}-${ti}`]}));
  return (
    <div className="reminders-grid">
      {TRIP.reminders.map((rem,ri)=>(
        <div className="reminder-card" key={ri}>
          <div className="rem-timing">{rem.timing}</div>
          {rem.tasks.map((task,ti)=>{
            const done=!!checked[`${ri}-${ti}`];
            return(<div className="rem-task" key={ti} onClick={()=>toggle(ri,ti)}><div className={`rem-cb${done?" on":""}`}>{done?"✓":""}</div><span className={`rem-txt${done?" done":""}`}>{task}</span></div>);
          })}
        </div>
      ))}
    </div>
  );
}

function InfoTab() {
  return <div className="info-grid">{Object.values(TRIP.practicalInfo).map(info=>(
    <div className="info-card" key={info.label}><div className="info-icon">{info.icon}</div><div className="info-lbl">{info.label}</div><div className="info-val">{info.value}</div></div>
  ))}</div>;
}

function PhotoSpotsTab() {
  return <div className="spots-grid">{TRIP.photoSpots.map((s,i)=>(
    <div className="spot-card" key={i}><div className="spot-city">📍 {s.city}</div><div className="spot-name">{s.spot}</div><div className="spot-time">🕐 {s.time}</div><div className="spot-tip">{s.tip}</div></div>
  ))}</div>;
}

function MapTab() {
  return (
    <div>
      <div className="map-card">
        <div className="map-header"><div className="section-title" style={{marginBottom:4}}>Circuit {TRIP.cities.join(" → ")}</div><div style={{fontSize:12,color:"var(--muted)"}}>Route côtière atlantique, ~400 km au total</div></div>
        <div className="map-cities">
          {[{name:"Marrakech",days:"Jours 1–2",icon:"🏙️",note:"La Ville Rouge"},{name:"Essaouira",days:"Jours 3–4",icon:"🌊",note:"La Cité des Vents"},{name:"Agadir",days:"Jours 5–7",icon:"🏖️",note:"La Riviera Marocaine"}].map(c=>(
            <div className="map-city" key={c.name}><div className="mc-icon">{c.icon}</div><div className="mc-name">{c.name}</div><div className="mc-days">{c.days}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{c.note}</div></div>
          ))}
        </div>
      </div>
      <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"16px 20px"}}>
        <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>🗺️ Ouvrir sur Google Maps</div>
        {[["Djemaa el-Fna, Marrakech","https://maps.google.com/?q=Djemaa+el+Fna+Marrakech"],["Jardin Majorelle","https://maps.google.com/?q=Jardin+Majorelle+Marrakech"],["Médina d'Essaouira","https://maps.google.com/?q=Medina+Essaouira+Morocco"],["Sidi Kaouki Beach","https://maps.google.com/?q=Sidi+Kaouki+Beach+Morocco"],["Plage d'Agadir","https://maps.google.com/?q=Plage+Agadir+Morocco"],["Parc National Souss-Massa","https://maps.google.com/?q=Souss+Massa+National+Park+Morocco"]].map(([name,url])=>(
          <a key={name} href={url} target="_blank" style={{color:"var(--gold)",textDecoration:"none",display:"flex",alignItems:"center",gap:8,fontSize:13,padding:"7px 0",borderBottom:"1px solid var(--border2)"}}>
            <span>📍</span>{name}<span style={{fontSize:10,color:"var(--muted)",marginLeft:"auto"}}>Ouvrir ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function NotesTab() {
  const [notes, setNotes] = useState({});
  return (
    <div>
      <p style={{fontSize:13,color:"var(--muted)",marginBottom:20,lineHeight:1.6}}>Tes notes personnelles pour chaque journée — réservations, adresses, idées.</p>
      <div className="notes-grid">
        {TRIP.itinerary.map(day=>(
          <div className="note-card" key={day.day}>
            <div className="note-day">Jour {day.day} — {day.city}</div>
            <div className="note-title">{day.title}</div>
            <textarea className="note-input" placeholder="Tes notes, rappels, réservations..." value={notes[day.day]||""} onChange={e=>setNotes(n=>({...n,[day.day]:e.target.value}))}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const TABS = [
  {id:"itinerary",icon:"🗺️",label:"Itinéraire"},
  {id:"map",icon:"📍",label:"Carte"},
  {id:"flights",icon:"✈️",label:"Vols"},
  {id:"hotels",icon:"🏨",label:"Hôtels"},
  {id:"restaurants",icon:"🍽️",label:"Restaurants"},
  {id:"weather",icon:"🌤️",label:"Météo"},
  {id:"budget",icon:"💰",label:"Budget"},
  {id:"health",icon:"💊",label:"Santé"},
  {id:"carbon",icon:"🌍",label:"Carbone"},
  {id:"family",icon:"👨‍👩‍👧",label:"Famille"},
  {id:"phrases",icon:"💬",label:"Phrasebook"},
  {id:"photos",icon:"📸",label:"Spots Photos"},
  {id:"reminders",icon:"🔔",label:"Rappels"},
  {id:"checklist",icon:"✅",label:"Checklist"},
  {id:"info",icon:"ℹ️",label:"Infos"},
  {id:"notes",icon:"📝",label:"Notes"},
];

export default function App() {
  const [tab, setTab] = useState("itinerary");
  const [printMode, setPrintMode] = useState(false);

const [form, setForm] = useState({
  destination: "",
  departureCity: "Paris",
  durationDays: 7,
  travelers: 2,
  budgetLevel: "confort",
  travelStyle: "mix",
  tripType: "couple",
  month: "",
  language: "fr"
});

const [tripData, setTripData] = useState(STATIC_TRIP);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

TRIP = tripData || STATIC_TRIP;

const renderTab = () => {
  switch (tab) {
    case "itinerary":
      return <div>{TRIP.itinerary.map((d) => <DayCard key={d.day} day={d} />)}</div>;
    case "map":
      return <MapTab />;
    case "flights":
      return <FlightsTab />;
    case "hotels":
      return <HotelsTab />;
    case "restaurants":
      return <RestaurantsTab />;
    case "weather":
      return <WeatherTab />;
    case "budget":
      return <BudgetTab />;
    case "health":
      return <HealthTab />;
    case "carbon":
      return <CarbonTab />;
    case "family":
      return <FamilyTab />;
    case "phrases":
      return <PhrasebookTab />;
    case "photos":
      return <PhotoSpotsTab />;
    case "reminders":
      return <RemindersTab />;
    case "checklist":
      return <ChecklistTab />;
    case "info":
      return <InfoTab />;
    case "notes":
      return <NotesTab />;
    default:
      return null;
  }
};

async function handleGenerate() {
  setLoading(true);
  setError("");

  try {
    const result = await generateTrip(form);
    setTripData(result);
    setTab("itinerary");
  } catch (err) {
    setError(err.message || "Impossible de générer le guide.");
  } finally {
    setLoading(false);
  }
}

return (
<div className={`app${printMode ? " print-mode" : ""}`}>
<style>{CSS}</style>

<header className="hdr">
<div className="logo">Voyage<em>IA</em></div>
<div className="hdr-trip">
{TRIP.destination} · {TRIP.duration} jours · {TRIP.travelers} adultes · {TRIP.budget}
</div>
<div className="hdr-actions">
<button
className={`hdr-btn${printMode ? " active" : ""}`}
onClick={() => setPrintMode((p) => !p)}
>
{printMode ? "✓ Mode impression" : "🖨️ Mode impression"}
</button>
<button className="hdr-btn no-print" onClick={() => window.print()}>
📄 Imprimer / PDF
</button>
</div>
</header>

{!printMode && (
<div className="hero">
<div className="hero-dest">{TRIP.destination}</div>
<p className="hero-sum">{TRIP.summary}</p>

<div className="chips">
{[
`✦ ${TRIP.duration} jours`,
`☀ ${TRIP.bestPeriod}`,
`👥 ${TRIP.travelers} adultes`,
`🏄 ${TRIP.style}`,
`💛 ${TRIP.budget}`
].map((c) => (
<span key={c} className="chip">{c}</span>
))}
</div>

<div style={{ marginTop: 24 }}>
<TripForm
form={form}
setForm={setForm}
onSubmit={handleGenerate}
loading={loading}
/>
{error ? (
<div style={{ color: "#ff8f8f", marginTop: 12, fontSize: 13 }}>
{error}
</div>
) : null}
</div>
</div>
)}

{!printMode && (
<nav className="nav">
{TABS.map((t) => (
<button
key={t.id}
className={`ntab${tab === t.id ? " on" : ""}`}
onClick={() => setTab(t.id)}
>
{t.icon} {t.label}
</button>
))}
</nav>
)}

<main className="main">
{printMode ? (
<div>
<div
style={{
textAlign: "center",
padding: "20px 0 32px",
borderBottom: "2px solid var(--border)"
}}
>
<div
style={{
fontFamily: "Playfair Display,serif",
fontSize: 48,
fontStyle: "italic",
color: "var(--gold)"
}}
>
{TRIP.destination}
</div>
<div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
{TRIP.duration} jours · {TRIP.travelers} adultes · {TRIP.budget} · {TRIP.departureCity} → {TRIP.destination}
</div>
</div>
{TRIP.itinerary.map((d) => <DayCard key={d.day} day={d} />)}
</div>
) : (
renderTab()
)}
</main>
</div>
);
}


  const renderTab = () => {
    switch(tab) {
      case "itinerary": return <div>{TRIP.itinerary.map(d=><DayCard key={d.day} day={d}/>)}</div>;
      case "map": return <MapTab/>;
      case "flights": return <FlightsTab/>;
      case "hotels": return <HotelsTab/>;
      case "restaurants": return <RestaurantsTab/>;
      case "weather": return <WeatherTab/>;
      case "budget": return <BudgetTab/>;
      case "health": return <HealthTab/>;
      case "carbon": return <CarbonTab/>;
      case "family": return <FamilyTab/>;
      case "phrases": return <PhrasebookTab/>;
      case "photos": return <PhotoSpotsTab/>;
      case "reminders": return <RemindersTab/>;
      case "checklist": return <ChecklistTab/>;
      case "info": return <InfoTab/>;
      case "notes": return <NotesTab/>;
      default: return null;
    }
  };

  return (
    <div className={`app${printMode?" print-mode":""}`}>
      <style>{CSS}</style>
      <header className="hdr">
        <div className="logo">Voyage<em>IA</em></div>
        <div className="hdr-trip">{TRIP.destination} · {TRIP.duration} jours · {TRIP.travelers} adultes · {TRIP.budget}</div>
        <div className="hdr-actions">
          <button className={`hdr-btn${printMode?" active":""}`} onClick={()=>setPrintMode(p=>!p)}>
            {printMode?"✓ Mode impression":"🖨️ Mode impression"}
          </button>
          <button className="hdr-btn no-print" onClick={()=>window.print()}>📄 Imprimer / PDF</button>
        </div>
      </header>

      {!printMode && (
        <div className="hero">
          <div className="hero-dest">{TRIP.destination}</div>
          <p className="hero-sum">{TRIP.summary}</p>
          <div className="chips">
            {["✦ 7 jours","☀ Mars–Mai / Sept–Nov","👥 2 adultes","🏄 Nature & Plages","🎶 Soirées","💛 Confort"].map(c=><span key={c} className="chip">{c}</span>)}
          </div>
        </div>
      )}

      {!printMode && (
        <nav className="nav">
          {TABS.map(t=>(
            <button key={t.id} className={`ntab${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      )}

      <main className="main">
        {printMode ? (
          <div>
            <div style={{textAlign:"center",padding:"20px 0 32px",borderBottom:"2px solid var(--border)"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:48,fontStyle:"italic",color:"var(--gold)"}}>Maroc</div>
              <div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>7 jours · 2 adultes · Confort · {TRIP.departureCity} → {TRIP.destination}</div>
            </div>
            {TRIP.itinerary.map(d=><DayCard key={d.day} day={d}/>)}
          </div>
        ) : renderTab()}
      </main>
    </div>
  );
}
