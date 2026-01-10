import { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/auth'
import { getLocale, type Translations } from './locales'

type I18nContextType = {
  locale: Translations
  lang: string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const [lang, setLang] = useState<string>(() => user?.language || 'en')

  // Update language when user object changes - use entire user as dependency
  // When setUser() is called with fresh data, this will trigger
  useEffect(() => {
    const userLang = user?.language || 'en'
    console.log('I18nProvider: user.language changed to', userLang, 'current lang:', lang, 'user:', user?.id)
    if (userLang !== lang) {
      console.log('I18nProvider: Updating lang from', lang, 'to', userLang)
      setLang(userLang)
    }
  }, [user]) // Using entire user object as dependency

  const value = {
    locale: getLocale(lang as 'en' | 'zh'),
    lang,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

// Helper hook for translations with parameters
export function useT() {
  const { locale, lang } = useI18n()

  return {
    t: (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: unknown = locale

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          return key // Return key if translation not found
        }
      }

      if (typeof value === 'string') {
        // Replace {{param}} placeholders
        return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
          return params?.[paramKey]?.toString() || `{{${paramKey}}}`
        })
      }

      return key
    },
    locale,
    lang,
  }
}
