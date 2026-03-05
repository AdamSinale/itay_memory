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
      addHeroForm: {
        titleEn: 'Add your hero',
        titleHe: 'הוסף גיבור',
        nameHe: 'שם החלל',
        nameEn: 'Hero\'s Name',
        rankHe: 'דרגה',
        rankEn: 'Rank',
        unitHe: 'יחידה',
        unitEn: 'Unit',
        captionHe: 'ביוגרפיה',
        captionEn: 'Biography',
        birthDate: 'Birth date',
        memorialDate: 'Memorial date',
        gender: 'Gender',
        photo: 'Photo',
        submit: 'Submit',
        success: 'Hero added successfully.',
        error: 'Failed to add hero. Please try again.',
        male: 'Male',
        female: 'Female',
        other: 'Other',
      },
    },
  },
  he: {
    translation: {
      nav: { home: 'בית', about: 'אודות', donate: 'תרומה', addHero: 'הוסף גיבור' },
      hero: { caption_fallback: 'לזכר those who gave their all.' },
      about: { title: 'ערך עיה', mission_fallback: 'טקסט המשימה של העמותה – לכבד את זכר הנופלים ולתמוך במשפחות השכולות.' },
      donate: { title: 'תמכו בעמותה', phone_label: 'תרומה בטלפון', donate_button: 'תרומה באמצעות PayPal' },
      language: { he: 'עברית', en: 'English' },
      addHeroForm: {
        title: 'הוסף גיבור',
        nameHe: 'שם (עברית)',
        nameEn: 'שם (אנגלית)',
        rankHe: 'דרגה (עברית)',
        rankEn: 'דרגה (אנגלית)',
        unitHe: 'יחידה (עברית)',
        unitEn: 'יחידה (אנגלית)',
        captionHe: 'תיאור / כיתוב (עברית)',
        captionEn: 'תיאור / כיתוב (אנגלית)',
        birthDate: 'תאריך לידה',
        memorialDate: 'תאריך נפילה',
        gender: 'מין',
        photo: 'תמונה',
        submit: 'שלח',
        success: 'הגיבור נוסף בהצלחה.',
        error: 'שגיאה בהוספת הגיבור. נסה שוב.',
        male: 'זכר',
        female: 'נקבה',
        other: 'אחר',
      },
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
