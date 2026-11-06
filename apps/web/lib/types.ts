// Types écrits à la main pour démarrer. Plus tard : `sanity typegen generate` pour les générer.

export type Img = {
	alt?: string | null
	hotspot?: { x: number; y: number } | null
	crop?: { top: number; bottom: number; left: number; right: number } | null
	asset?: {
		_id: string;
		url: string;
		metadata?: { lqip?: string; dimensions?: { width: number; height: number } }
	} | null
} | null

export type Seo = { title?: string; description?: string } | null

export type Block = { _type: string; _key?: string; [k: string]: unknown }

export type Carac = { cle?: string | null; valeur?: string | null }

export type Settings = {
	nomEntreprise?: string
	slogan?: string
	presentation?: string
	logo?: Img
	aProposTitre?: string
	aProposTexte?: Block[]
	aProposImage?: Img
	valeurs?: { titre: string; description?: string }[]
	chiffresCles?: { valeur: string; libelle: string }[]
	telephone?: string[]
	whatsapp?: string[]
	email?: string
	adresse?: string
	ville?: string
	horaires?: string
	zoneCouverture?: string
	rccm?: string
	nina?: string
	facebook?: string
	instagram?: string
	linkedin?: string
	youtube?: string
	tiktok?: string
}

export type MenuMetier = {
	title: string
	slug: string
	accroche?: string
	aCatalogue: boolean
	categories: { title: string; slug: string, image: Img | null }[]
}

export type Metier = MenuMetier & {
	_id?: string
	description?: string
	image?: Img
	prestations?: { titre: string; description?: string }[]
	seo?: Seo
}

export type ProductCard = {
	_id: string
	name: string
	slug: string
	sku: string
	accroche?: string
	marque?: string
	image?: Img
	caracteristiques?: Carac[]
	categorie: { title: string; slug: string; metier: { slug: string } }
}

export type Product = ProductCard & {
	pointsForts?: string[]
	description?: Block[]
	images?: Img[]
	videoUrl?: string
	ficheTechniqueUrl?: string
	lienFabricant?: string
	categorie: { title: string; slug: string; metier: { title: string; slug: string } }
	similaires?: ProductCard[]
	realisations?: RealisationCard[]
	seo?: Seo
}

export type Categorie = {
	title: string
	slug: string
	description?: string
	image?: Img
	filtres?: string[]
	metier: { title: string; slug: string }
	seo?: Seo
}

export type RealisationCard = {
	_id: string
	title: string
	slug: string
	resume?: string
	ville?: string
	typeClient?: string
	date?: string
	image?: Img
	metiers?: { title: string; slug: string }[]
}

export type Realisation = RealisationCard & {
	client?: string
	contexte?: Block[]
	solution?: Block[]
	resultat?: Block[]
	images?: Img[]
	videoUrl?: string
	produits?: ProductCard[]
	seo?: Seo
}

export type ClientRef = { _id: string; nom: string; secteur?: string; logo?: Img }
