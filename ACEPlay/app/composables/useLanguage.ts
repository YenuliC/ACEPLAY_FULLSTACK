// Pure constants and utility functions – no Vue composables called here.
// Reactivity (useI18n, computed) is handled in each component that imports this file.

export type LocaleCode = 'en' | 'th' | 'fil' | 'bn' | 'zh' | 'km' | 'vi' | 'id'

export interface Language {
  code: LocaleCode
  flag: string
  flagUrl: string
  name: string
}

export const LANGUAGES: Language[] = [
  { code: 'en', flag: '🇬🇧', flagUrl: 'https://flagcdn.com/w20/gb.png', name: 'English' },
  { code: 'th', flag: '🇹🇭', flagUrl: 'https://flagcdn.com/w20/th.png', name: 'ภาษาไทย' },
  { code: 'fil', flag: '🇵🇭', flagUrl: 'https://flagcdn.com/w20/ph.png', name: 'Filipino' },
  { code: 'bn', flag: '🇧🇩', flagUrl: 'https://flagcdn.com/w20/bd.png', name: 'বাংলা' },
  { code: 'zh', flag: '🇨🇳', flagUrl: 'https://flagcdn.com/w20/cn.png', name: '中文' },
  { code: 'km', flag: '🇰🇭', flagUrl: 'https://flagcdn.com/w20/kh.png', name: 'ភាសាខ្មែរ' },
  { code: 'vi', flag: '🇻🇳', flagUrl: 'https://flagcdn.com/w20/vn.png', name: 'Tiếng Việt' },
  { code: 'id', flag: '🇮🇩', flagUrl: 'https://flagcdn.com/w20/id.png', name: 'Bahasa' }
]

const STORAGE_KEY = 'aceplay-locale'

/** Persists the chosen locale to localStorage (client-only). */
export function saveLocale(code: LocaleCode): void {
  if (import.meta.client) {
    window.localStorage.setItem(STORAGE_KEY, code)
  }
}

/** Reads the previously saved locale from localStorage. Returns null on server or if none saved. */
export function getStoredLocale(): LocaleCode | null {
  if (!import.meta.client) return null
  const saved = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null
  if (saved && LANGUAGES.some((l) => l.code === saved)) return saved
  return null
}
