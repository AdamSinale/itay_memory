import { useTranslation } from 'react-i18next'
import styles from './LanguageToggle.module.css'
import FlagIL from '../assets/FlagIL.svg?react'
import FlagUS from '../assets/FlagUS.svg?react'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const isHebrew = i18n.language === 'he'

  return (
    <div className={styles.dark_mode}>
      <input
        className={styles.dark_mode_input}
        type="checkbox"
        id="darkmode-toggle"
        checked={isHebrew}
        onChange={(e) => i18n.changeLanguage(e.currentTarget.checked ? 'he' : 'en')}
      />
      <label className={styles.dark_mode_label} htmlFor="darkmode-toggle">
        <FlagIL className={styles.il} />
        <FlagUS className={styles.us} />
      </label>
    </div>
  )
}