# Import du contenu : pôle « Contrôle d’accès et anti-intrusion »

Ce dossier te permet de saisir les produits dans un tableur, puis de les envoyer dans Sanity d’un coup (au lieu de tout taper dans le Studio).

## Contenu
- `seed-controle-acces.ndjson` : le pôle, ses 7 catégories et leurs filtres (à importer une seule fois).
- `produits-modele.csv` : le tableau à remplir (copie-le en `produits.csv`).
- `csv-to-ndjson.mjs` : convertit `produits.csv` en fichier prêt à importer et signale les erreurs.
- `images/` : mets-y les photos et les PDF cités dans le tableau.

## Étapes
1. **Importer le pôle et les catégories** (depuis le dossier du Studio) :
   `npx sanity dataset import seed-controle-acces.ndjson production --missing`
   (`--missing` n’écrase pas ce que tu as déjà modifié dans le Studio.)
2. **Remplir `produits.csv`** (Excel ou LibreOffice, enregistrer en CSV UTF-8, séparateur `;`). Une ligne par produit.
3. **Convertir** : `node import/csv-to-ndjson.mjs import/produits.csv`
   Le script affiche les erreurs (catégorie inconnue, SKU en double) et les avertissements (filtre non renseigné, image absente).
4. **Importer les produits** : `npx sanity dataset import import/produits.ndjson production --replace`
   `--replace` met à jour un produit déjà importé (même SKU) : utile tant que le CSV reste ta référence.
   Dès que tu modifies un produit dans le Studio, ne le réimporte plus avec `--replace` : utilise `--missing` pour n’ajouter que les nouveaux.
5. **Vérifier dans le Studio** : images, textes alternatifs, catégories. Les produits sans image ne peuvent pas être publiés.

## Colonnes du CSV
| Colonne | Contenu |
|---|---|
| `sku` | Référence du modèle (ex : le code exact sur la fiche Dahua). Unique, ne change jamais. Ce n’est pas le numéro de série d’un appareil, qui est différent pour chaque unité. |
| `nom` | Nom en français : type de produit + caractéristique clé (ex : « Terminal facial autonome 7 pouces »). |
| `categorie` | Le slug de la catégorie (voir liste ci-dessous). |
| `marque` | Dahua, etc. |
| `accroche` | Une phrase qui dit ce que le client y gagne. 160 caractères maximum. |
| `points_forts` | 3 à 5 points forts séparés par `|`, réécrits avec tes mots. |
| `caracteristiques` | `Nom=Valeur` séparés par `|` (ex : `Alimentation=PoE|Protection=IP65`). Les ports et interfaces vont ici (ex : `Ports=RS-485, Wiegand`). |
| `description` | Texte de l’entreprise. Une ligne vide sépare les paragraphes. |
| `image1` à `image4` | Noms des fichiers dans `images/` (ou un lien https). La première est l’image principale. |
| `fiche_technique` | Nom du PDF dans `images/` (optionnel). |
| `video_url`, `lien_fabricant` | Liens complets (optionnel). |
| `mettre_en_avant` | `oui` pour l’afficher sur l’accueil. |

Les lignes dont le `sku` commence par `EXEMPLE` sont ignorées.

## Catégories et filtres
| Slug | Catégorie | Filtres (à renseigner dans `caracteristiques`) |
|---|---|---|
| `terminaux-biometriques` | Terminaux biométriques et reconnaissance faciale | Mode d’identification, Écran, Alimentation, Protection, Gestion de présence |
| `controleurs-acces` | Contrôleurs d’accès | Nombre de portes, Interface lecteurs, Alimentation |
| `lecteurs-cartes` | Lecteurs de cartes et badges | Technologie, Interface, Clavier, Protection |
| `ventouses-serrures` | Ventouses et serrures électriques | Force de maintien, Tension, Montage, Détection d’état |
| `modules-accessoires` | Modules et accessoires | Type, Tension |
| `alarmes-detecteurs` | Alarmes, détecteurs et sirènes | Type, Communication, Alimentation |
| `pointage-presence` | Pointage et gestion de présence | Mode d’identification, Capacité utilisateurs, Alimentation |

Un produit appartient à **une seule** catégorie. Un terminal facial qui fait aussi le pointage reste dans « Terminaux biométriques » avec `Gestion de présence=Oui`. Réserve « Pointage et gestion de présence » aux appareils conçus d’abord pour cela.

**Valeurs :** même écriture partout (`4 MP`, `30 m`, `IP65`, `PoE`, `12 V`, `Oui`/`Non`), sinon les filtres se dédoublent. Le script corrige la casse et les accents des noms de filtre, pas ceux des valeurs.

## Traduction : termes à utiliser
| Fiche en anglais | En français |
|---|---|
| Access controller | contrôleur d’accès |
| Standalone access terminal | terminal d’accès autonome |
| Card reader | lecteur de cartes |
| Maglock, electromagnetic lock | ventouse électromagnétique |
| Electric strike | gâche électrique |
| Exit button, REX | bouton de sortie |
| Break glass | bris de glace (déclencheur manuel) |
| Door contact | contact de porte (détecteur d’ouverture) |
| Face recognition | reconnaissance faciale |
| Fingerprint | empreinte digitale |
| Time and attendance | gestion de présence, pointage |
| Anti-passback | anti-retour |
| Interlock | interverrouillage (sas) |
| Tailgating | talonnage (deux personnes avec un seul badge) |
| Alarm panel, hub | centrale d’alarme |
| PIR detector | détecteur de mouvement infrarouge |
| Siren | sirène |
| Holding force | force de maintien |
| Duress code | code de contrainte |
| Wireless | sans fil |

Wiegand, RS-485, OSDP, TCP/IP, PoE, IP65 restent tels quels.

## Rappels
- Réécris les descriptions avec tes mots : copier le texte du fabricant est mauvais pour le SEO.
- Vérifie que tu as le droit d’utiliser les images du fabricant. Tes propres photos de produits installés sont le meilleur choix.
- Les prix ne sont pas affichés : tout passe par la demande de devis.
