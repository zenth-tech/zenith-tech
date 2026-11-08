// Données d'exemple affichées tant que Sanity n'est pas configuré (NEXT_PUBLIC_SANITY_PROJECT_ID vide).
// Les clients et numéros ci-dessous sont fictifs.
import type {
  Categorie, ClientRef, MenuMetier, Metier, Product, ProductCard, Realisation, RealisationCard, Settings,
} from './types'

export const mockSettings: Settings = {
  nomEntreprise: 'ZENITH TECH-SARL',
  slogan: 'Sécurité, énergie et infrastructures',
  presentation:
    'Nous concevons, installons et maintenons la sécurité électronique, l’énergie solaire et les infrastructures informatiques de vos bâtiments à Bamako.',
  aProposTitre: 'Une référence de la sécurité des bâtiments à Bamako',
  valeurs: [
    {titre: 'Savoir-faire', description: 'Des techniciens formés aux équipements que nous installons.'},
    {titre: 'Disponibilité', description: 'Une équipe joignable avant, pendant et après le chantier.'},
    {titre: 'Qualité', description: 'Des produits sélectionnés pour durer sous le climat malien.'},
    {titre: 'Sécurité', description: 'Des installations conformes et testées avant la remise.'},
    {titre: 'Ponctualité', description: 'Des délais annoncés, puis tenus.'},
  ],
  chiffresCles: [
    {valeur: '5+', libelle: 'ans d’expérience'},
    {valeur: '6', libelle: 'pôles d’activité'},
  ],
  telephone: ['+223 00 00 00 00'],
  whatsapp: ['22300000000'],
  email: 'contact@exemple.ml',
  adresse: 'Avenue de Kalaban Coro, Golf, Bamako',
  ville: 'Bamako',
  horaires: 'Lundi au samedi, 8h – 18h',
  zoneCouverture: 'Bamako et tout le Mali',
  rccm: 'À renseigner',
  nina: 'À renseigner',
}

const metiers: Metier[] = [
  {
    title: 'Vidéosurveillance', slug: 'videosurveillance', aCatalogue: true,
    accroche: 'Caméras IP, enregistreurs et supervision à distance.',
    description: 'Étude du site, pose des caméras, configuration de l’enregistrement et de la consultation à distance.',
    categories: [{title: 'Caméras IP', slug: 'cameras-ip', image: null}, {title: 'Enregistreurs', slug: 'enregistreurs', image: null}],
    prestations: [
      {titre: 'Étude et plan d’implantation', description: 'Visite du site et choix des emplacements.'},
      {titre: 'Installation et configuration', description: 'Pose, câblage et accès à distance sur téléphone.'},
    ],
  },
  {
    title: 'Contrôle d’accès et anti-intrusion', slug: 'controle-acces', aCatalogue: true,
    accroche: 'Badges, digicodes, alarmes et portiers vidéo.',
    categories: [{title: 'Contrôle d’accès', slug: 'controle-acces-lecteurs', image: null}],
    prestations: [{titre: 'Portier vidéo'}, {titre: 'Système anti-intrusion'}],
  },
  {
    title: 'Énergie solaire', slug: 'photovoltaique', aCatalogue: true,
    accroche: 'Panneaux, onduleurs et stockage pour votre site.',
    categories: [{title: 'Onduleurs', slug: 'onduleurs', image: null}, {title: 'Panneaux solaires', slug: 'panneaux', image: null}],
    prestations: [{titre: 'Étude et dimensionnement'}, {titre: 'Installation et mise en service'}],
  },
  {
    title: 'Cybersécurité', slug: 'cybersecurite', aCatalogue: false,
    accroche: 'Protection des données, audits et tests d’intrusion.',
    categories: [],
    prestations: [
      {titre: 'Tests d’intrusion et analyse de vulnérabilités'},
      {titre: 'Pare-feu, VPN et sécurité réseau'},
      {titre: 'Conformité et réponse aux incidents'},
    ],
  },
  {
    title: 'Réseaux et télécoms', slug: 'reseaux-telecoms', aCatalogue: false,
    accroche: 'Réseaux locaux, téléphonie et infrastructures.',
    categories: [],
    prestations: [{titre: 'Ingénierie LAN, WAN et Wi-Fi'}, {titre: 'Sauvegarde et reprise après sinistre'}],
  },
  {
    title: 'Systèmes d’information et Microsoft 365', slug: 'systemes-information', aCatalogue: false,
    accroche: 'Administration, Microsoft 365 et support utilisateurs.',
    categories: [],
    prestations: [{titre: 'Microsoft 365 et Azure'}, {titre: 'Postes de travail et support'}],
  },
]

export const mockMetiers = metiers
export const mockMenu: MenuMetier[] = metiers

const cat = (metierSlug: string): ProductCard['categorie'] => ({title: '', slug: '', metier: {slug: metierSlug}})

export const mockProducts: ProductCard[] = [
  {
    _id: 'p1', name: 'Caméra dôme IP 4 MP', slug: 'camera-dome-ip-4mp', sku: 'CAM-DOME-4MP',
    accroche: 'Image nette de jour comme de nuit pour les entrées et couloirs.', marque: 'Marque exemple',
    caracteristiques: [{cle: 'Résolution', valeur: '4 MP'}, {cle: 'Vision nocturne', valeur: '30 m'}, {cle: 'Protection', valeur: 'IP67'}],
    categorie: {...cat('videosurveillance'), title: 'Caméras IP', slug: 'cameras-ip'},
  },
  {
    _id: 'p2', name: 'Caméra tube IP 8 MP', slug: 'camera-tube-ip-8mp', sku: 'CAM-TUBE-8MP',
    accroche: 'Grande portée pour les cours et parkings.', marque: 'Marque exemple',
    caracteristiques: [{cle: 'Résolution', valeur: '8 MP'}, {cle: 'Vision nocturne', valeur: '60 m'}, {cle: 'Protection', valeur: 'IP67'}],
    categorie: {...cat('videosurveillance'), title: 'Caméras IP', slug: 'cameras-ip'},
  },
  {
    _id: 'p3', name: 'Caméra IP 2 MP intérieure', slug: 'camera-ip-2mp', sku: 'CAM-INT-2MP',
    accroche: 'Surveillance discrète pour bureaux et boutiques.', marque: 'Marque exemple',
    caracteristiques: [{cle: 'Résolution', valeur: '2 MP'}, {cle: 'Vision nocturne', valeur: '20 m'}, {cle: 'Protection', valeur: 'IP20'}],
    categorie: {...cat('videosurveillance'), title: 'Caméras IP', slug: 'cameras-ip'},
  },
  {
    _id: 'p4', name: 'Onduleur hybride 5 kW', slug: 'onduleur-hybride-5kw', sku: 'OND-HYB-5K',
    accroche: 'Alimente votre bâtiment avec le solaire et le réseau.', marque: 'Marque exemple',
    caracteristiques: [{cle: 'Puissance', valeur: '5 kW'}, {cle: 'Tension batterie', valeur: '48 V'}],
    categorie: {...cat('photovoltaique'), title: 'Onduleurs', slug: 'onduleurs'},
  },
]

export const mockCategories: Categorie[] = [
  {title: 'Caméras IP', slug: 'cameras-ip', description: 'Caméras dôme, tube et PTZ pour l’intérieur et l’extérieur.',
    filtres: ['Résolution', 'Vision nocturne'], metier: {title: 'Vidéosurveillance', slug: 'videosurveillance'}},
  {title: 'Enregistreurs', slug: 'enregistreurs', filtres: [], metier: {title: 'Vidéosurveillance', slug: 'videosurveillance'}},
  {title: 'Onduleurs', slug: 'onduleurs', filtres: ['Puissance'], metier: {title: 'Énergie solaire', slug: 'photovoltaique'}},
  {title: 'Panneaux solaires', slug: 'panneaux', filtres: [], metier: {title: 'Énergie solaire', slug: 'photovoltaique'}},
  {title: 'Contrôle d’accès', slug: 'controle-acces-lecteurs', filtres: [], metier: {title: 'Contrôle d’accès et anti-intrusion', slug: 'controle-acces'}},
]

export const mockRealisations: RealisationCard[] = [
  {_id: 'r1', title: 'Vidéosurveillance d’un groupe scolaire', slug: 'groupe-scolaire', ville: 'Bamako', typeClient: 'entreprise',
    resume: '24 caméras et enregistrement centralisé pour sécuriser les cours et les entrées.',
    metiers: [{title: 'Vidéosurveillance', slug: 'videosurveillance'}]},
  {_id: 'r2', title: 'Toiture solaire d’une usine', slug: 'usine-solaire', ville: 'Bamako', typeClient: 'entreprise',
    resume: 'Installation photovoltaïque avec stockage pour réduire la dépendance au réseau.',
    metiers: [{title: 'Énergie solaire', slug: 'photovoltaique'}]},
]

export const mockClients: ClientRef[] = [
  {_id: 'c1', nom: 'Client exemple A', secteur: 'Énergie'},
  {_id: 'c2', nom: 'Client exemple B', secteur: 'Éducation'},
  {_id: 'c3', nom: 'Client exemple C', secteur: 'Construction'},
  {_id: 'c4', nom: 'Client exemple D', secteur: 'Industrie'},
]

export const mockProductDetail = (p: ProductCard): Product => ({
  ...p,
  categorie: {...p.categorie, metier: {title: mockMetiers.find((m) => m.slug === p.categorie.metier.slug)?.title ?? '', slug: p.categorie.metier.slug}},
  pointsForts: ['Installation et configuration incluses', 'Accès à distance sur téléphone', 'Garantie et maintenance par notre équipe'],
  similaires: mockProducts.filter((x) => x._id !== p._id && x.categorie.slug === p.categorie.slug),
  realisations: mockRealisations.slice(0, 1),
})

export const mockRealisationDetail = (r: RealisationCard): Realisation => ({
  ...r,
  produits: mockProducts.slice(0, 2),
})
