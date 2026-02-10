import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', about: 'About', donate: 'Donate', addHero: 'Add your hero' },
      hero: { caption_fallback: 'In memory of those who gave their all.' },
      about: { title: 'Purpose of the Foundation', mission_fallback: "The foundation's mission is to honor the memory of the fallen and support bereaved families." },
      donate: { title: 'Support the Foundation', phone_label: 'Donation by phone', donate_button: 'Donate with PayPal' },
      language: { he: 'עברית', en: 'English' },
    },
  },
  he: {
    translation: {
      nav: { home: 'בית', about: 'אודות', donate: 'תרומה', addHero: 'הוסף גיבור' },
      hero: { caption_fallback: 'לזכר those who gave their all.' },
      about: { title: 'ערך עיה', mission_fallback: 'טקסט המשימה של העמותה – לכבד את זכר הנופלים ולתמוך במשפחות השכולות.' },
      donate: { title: 'תמכו בעמותה', phone_label: 'תרומה בטלפון', donate_button: 'תרומה באמצעות PayPal' },
      language: { he: 'עברית', en: 'English' },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
