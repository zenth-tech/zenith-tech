import {NextResponse} from 'next/server'

// Limitation simple en mémoire (par instance). À remplacer par Upstash/Redis ou Cloudflare Turnstile en production.
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnu'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    return NextResponse.json({error: 'Trop de demandes. Réessayez dans quelques minutes.'}, {status: 429})
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({error: 'Requête invalide'}, {status: 400})
  }

  // Piège à robots : on répond « ok » sans rien enregistrer
  if (str(body.website, 100)) return NextResponse.json({ok: true})

  const canal = ['whatsapp', 'telephone', 'email'].includes(String(body.canal)) ? String(body.canal) : 'whatsapp'
  const quote = {
    nom: str(body.nom, 120),
    telephone: str(body.telephone, 40),
    email: str(body.email, 160),
    ville: str(body.ville, 80),
    typeClient: body.typeClient === 'entreprise' ? 'entreprise' : 'particulier',
    canal,
    message: str(body.message, 3000),
    items: (Array.isArray(body.items) ? body.items : []).slice(0, 50).map((i) => {
      const it = (i ?? {}) as Record<string, unknown>
      return {sku: str(it.sku, 60), name: str(it.name, 160), qty: Math.max(1, Math.min(999, Number(it.qty) || 1))}
    }),
    receivedAt: new Date().toISOString(),
  }

  if (!quote.nom) return NextResponse.json({error: 'Indiquez votre nom.'}, {status: 400})
  if (canal === 'email' ? !/^\S+@\S+\.\S+$/.test(quote.email) : quote.telephone.replace(/\D/g, '').length < 8) {
    return NextResponse.json(
      {error: canal === 'email' ? 'Indiquez un email valide.' : 'Indiquez un numéro de téléphone valide.'},
      {status: 400},
    )
  }
  if (quote.items.length === 0 && !quote.message) {
    return NextResponse.json({error: 'Ajoutez un produit ou décrivez votre besoin.'}, {status: 400})
  }

  hits.set(ip, [...recent, now])

  // Transmet la demande à votre futur ERP (NestJS) ou à tout service qui accepte du JSON.
  const webhook = process.env.QUOTE_WEBHOOK_URL
  if (webhook) {
    try {
      const res = await fetch(webhook, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(quote)})
      if (!res.ok) throw new Error(`Webhook ${res.status}`)
    } catch (err) {
      console.error('[devis] échec du webhook', err)
      return NextResponse.json({error: 'Envoi impossible pour le moment. Contactez-nous par WhatsApp ou téléphone.'}, {status: 502})
    }
  } else {
    console.info('[devis] nouvelle demande (aucun QUOTE_WEBHOOK_URL configuré)', JSON.stringify(quote))
  }

  return NextResponse.json({ok: true})
}
