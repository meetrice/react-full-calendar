import { en } from './en'
import { zh } from './zh'
import type { LanguageCode } from '@/auth/lib/models'

export const locales = {
  en,
  zh,
} as const

export type Locale = keyof typeof locales
export type Translations = typeof en

// Get locale by language code
export function getLocale(lang: LanguageCode): Translations {
  return locales[lang as Locale] || locales.en
}

// Format translated string with parameters
export function t(template: string, params?: Record<string, string | number>): string {
  if (!params) return template

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() || `{{${key}}}`
  })
}
