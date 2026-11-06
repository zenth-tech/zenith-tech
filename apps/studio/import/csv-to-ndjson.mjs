#!/usr/bin/env node
/**
 * Convertit produits.csv en fichier NDJSON importable dans Sanity.
 *
 * Usage :
 *   node import/csv-to-ndjson.mjs import/produits.csv [--images import/images] [--seed import/seed-controle-acces.ndjson] [--out import/produits.ndjson]
 *
 * Sans dépendance (Node 18+ ou Bun).
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {dirname, resolve} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const csvPath = args[0] && !args[0].startsWith('--') ? args[0] : resolve(here, 'produits.csv')
const imagesDir = resolve(flag('--images', resolve(here, 'images')))
const seedPath = resolve(flag('--seed', resolve(here, 'seed-controle-acces.ndjson')))
const outPath = resolve(flag('--out', resolve(here, 'produits.ndjson')))

const errors = []
const warnings = []
const err = (line, msg) => errors.push(`ligne ${line} : ${msg}`)
const warn = (line, msg) => warnings.push(`ligne ${line} : ${msg}`)

// ---------- outils ----------
const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .trim()
    .toLowerCase()
const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const keyOf = (...parts) => createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 12)
const yes = (v) => ['oui', 'o', 'yes', 'y', '1', 'true', 'vrai'].includes(norm(v))
const isUrl = (v) => /^https?:\/\//i.test(v)

/** Lecteur CSV (guillemets, séparateurs et retours à la ligne dans les cellules). */
function parseCsv(text) {
  text = text.replace(/^\uFEFF/, '')
  const firstLine = text.split(/\r?\n/, 1)[0]
  const count = (c) => firstLine.split(c).length - 1
  const delim = [';', ',', '\t'].sort((a, b) => count(b) - count(a))[0]
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === delim) { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some((x) => x.trim() !== '')) rows.push(row)
      row = []
    } else cell += c
  }
  row.push(cell)
  if (row.some((x) => x.trim() !== '')) rows.push(row)
  return rows
}

// ---------- catégories connues (fichier seed) ----------
if (!existsSync(seedPath)) { console.error(`Fichier seed introuvable : ${seedPath}`); process.exit(1) }
const categories = new Map()
for (const line of readFileSync(seedPath, 'utf8').split('\n').filter(Boolean)) {
  const d = JSON.parse(line)
  if (d._type === 'categorie') categories.set(d.slug.current, {id: d._id, title: d.title, filtres: d.filtres ?? []})
}

// ---------- lecture du CSV ----------
if (!existsSync(csvPath)) { console.error(`CSV introuvable : ${csvPath}`); process.exit(1) }
const table = parseCsv(readFileSync(csvPath, 'utf8'))
const header = table[0].map((h) => norm(h).replace(/\s+/g, '_'))
const records = table.slice(1).map((cells, i) => ({
  line: i + 2,
  get: (name) => (cells[header.indexOf(name)] ?? '').trim(),
}))
for (const required of ['sku', 'nom', 'categorie']) {
  if (!header.includes(required)) { console.error(`Colonne obligatoire absente : ${required}`); process.exit(1) }
}

// ---------- conversion ----------
const docs = []
const seenSku = new Set()
const seenSlug = new Set()

const toBlocks = (text, seed) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .map((p, i) => ({
      _type: 'block',
      _key: keyOf(seed, 'b', i),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: keyOf(seed, 's', i), text: p, marks: []}],
    }))

const assetUrl = (name, line, label) => {
  if (isUrl(name)) return name
  const full = resolve(imagesDir, name)
  if (!existsSync(full)) { warn(line, `${label} « ${name} » introuvable dans ${imagesDir} (ignoré)`); return null }
  return pathToFileURL(full).href
}

for (const r of records) {
  const sku = r.get('sku')
  if (!sku || norm(sku).startsWith('exemple')) continue // lignes d'exemple ignorées

  const nom = r.get('nom')
  const catSlug = r.get('categorie')
  const cat = categories.get(catSlug)
  if (!nom) { err(r.line, `nom manquant (${sku})`); continue }
  if (!cat) { err(r.line, `catégorie inconnue « ${catSlug} » (possibles : ${[...categories.keys()].join(', ')})`); continue }
  if (seenSku.has(norm(sku))) { err(r.line, `SKU en double : ${sku}`); continue }
  seenSku.add(norm(sku))

  let slug = slugify(nom)
  if (seenSlug.has(`${catSlug}/${slug}`)) slug = `${slug}-${slugify(sku)}`
  seenSlug.add(`${catSlug}/${slug}`)

  const accroche = r.get('accroche')
  if (accroche.length > 160) warn(r.line, `accroche de ${accroche.length} caractères (max 160) : ${sku}`)

  const pointsForts = r.get('points_forts').split('|').map((s) => s.trim()).filter(Boolean)
  if (pointsForts.length > 6) warn(r.line, `${pointsForts.length} points forts (gardez 3 à 5) : ${sku}`)

  // caractéristiques : « Nom=Valeur|Nom=Valeur », nom corrigé selon les filtres de la catégorie
  const caracteristiques = []
  for (const part of r.get('caracteristiques').split('|').map((s) => s.trim()).filter(Boolean)) {
    const eq = part.indexOf('=')
    if (eq < 1) { warn(r.line, `caractéristique mal écrite « ${part} » (format Nom=Valeur) : ${sku}`); continue }
    let cle = part.slice(0, eq).trim()
    const valeur = part.slice(eq + 1).trim()
    const canon = cat.filtres.find((f) => norm(f) === norm(cle))
    if (canon && canon !== cle) { cle = canon }
    if (!valeur) { warn(r.line, `valeur vide pour « ${cle} » : ${sku}`); continue }
    caracteristiques.push({_type: 'caracteristique', _key: keyOf(sku, 'c', cle), cle, valeur})
  }
  for (const f of cat.filtres) {
    if (!caracteristiques.some((c) => c.cle === f)) warn(r.line, `filtre « ${f} » non renseigné : ${sku}`)
  }

  const images = []
  for (let n = 1; n <= 4; n++) {
    const name = r.get(`image${n}`)
    if (!name) continue
    const url = assetUrl(name, r.line, `image${n}`)
    if (!url) continue
    images.push({
      _type: 'imageWithAlt',
      _key: keyOf(sku, 'i', n),
      alt: n === 1 ? nom : `${nom}, vue ${n}`,
      asset: {_type: 'reference', _sanityAsset: `image@${url}`},
    })
  }
  if (images.length === 0) warn(r.line, `aucune image : ${sku} (à ajouter dans le Studio, l'image est obligatoire pour publier)`)

  const doc = {
    _id: `product-${slugify(sku)}`,
    _type: 'product',
    name: nom,
    slug: {_type: 'slug', current: slug},
    sku,
    categorie: {_type: 'reference', _ref: cat.id},
    mettreEnAvant: yes(r.get('mettre_en_avant')),
  }
  const marque = r.get('marque')
  if (marque) doc.marque = marque
  if (accroche) doc.accroche = accroche
  if (pointsForts.length) doc.pointsForts = pointsForts
  const description = toBlocks(r.get('description'), sku)
  if (description.length) doc.description = description
  if (caracteristiques.length) doc.caracteristiques = caracteristiques
  if (images.length) doc.images = images

  const fiche = r.get('fiche_technique')
  if (fiche) {
    const url = assetUrl(fiche, r.line, 'fiche_technique')
    if (url) doc.ficheTechnique = {_type: 'file', asset: {_type: 'reference', _sanityAsset: `file@${url}`}}
  }
  for (const [col, field] of [['video_url', 'videoUrl'], ['lien_fabricant', 'lienFabricant']]) {
    const v = r.get(col)
    if (!v) continue
    if (!isUrl(v)) warn(r.line, `${col} doit commencer par http(s):// : ${sku}`)
    else doc[field] = v
  }
  docs.push(doc)
}

// ---------- résultat ----------
for (const w of warnings) console.warn(`Avertissement, ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`Erreur, ${e}`)
  console.error(`\n${errors.length} erreur(s) : aucun fichier écrit. Corrigez le CSV puis relancez.`)
  process.exit(1)
}
writeFileSync(outPath, docs.map((d) => JSON.stringify(d)).join('\n') + (docs.length ? '\n' : ''), 'utf8')
console.log(`\n${docs.length} produit(s) écrit(s) dans ${outPath} (${warnings.length} avertissement(s)).`)
console.log(`Import : npx sanity dataset import ${outPath} <dataset> --replace`)
