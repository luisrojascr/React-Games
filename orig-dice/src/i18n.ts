import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import translationEN from './locales/en.json'
import translationCH from './locales/ch.json'
import translationJP from './locales/jp.json'
import translationFR from './locales/fr.json'
import translationDE from './locales/de.json'
import translationRU from './locales/ru.json'

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  ch: {
    translation: translationCH
  },
  jp: {
    translation: translationJP
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  ru: {
    translation: translationRU
  }
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
