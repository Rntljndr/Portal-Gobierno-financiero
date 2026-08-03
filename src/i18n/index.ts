import { es } from './locales/es'

type Dictionary = typeof es
type TranslationKey = keyof Dictionary

const dictionary: Dictionary = es

export function useTranslation() {
  function t(key: TranslationKey): string {
    return dictionary[key]
  }
  return { t }
}
