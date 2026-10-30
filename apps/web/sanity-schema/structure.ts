import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      // Document unique (singleton)
      S.listItem()
        .title('Paramètres du site')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('metier').title('Pôles d’activité'),
      S.documentTypeListItem('categorie').title('Catégories'),
      S.documentTypeListItem('product').title('Produits'),
      S.divider(),
      S.documentTypeListItem('realisation').title('Réalisations'),
      S.documentTypeListItem('referenceClient').title('Clients références'),
    ])
