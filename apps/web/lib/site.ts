import type {Settings} from './types'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const digits = (s?: string) => (s ?? '').replace(/\D/g, '')

export const telHref = (s?: Settings) => (s?.telephone ? `tel:+${digits(s.telephone)}` : undefined)

export const whatsappHref = (s?: Settings, message?: string) =>
  s?.whatsapp
    ? `https://wa.me/${digits(s.whatsapp)}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    : undefined

export const mailHref = (s?: Settings, subject?: string) =>
  s?.email ? `mailto:${s.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}` : undefined
