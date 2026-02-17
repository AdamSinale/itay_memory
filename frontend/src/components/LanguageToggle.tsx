import { Switch } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import styles from './LanguageToggle.module.css'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const isHebrew = i18n.language === 'he'

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{t('language.en')}</span>
      <Switch
        size="md"
        checked={isHebrew}
        onChange={(e) => i18n.changeLanguage(e.currentTarget.checked ? 'he' : 'en')}
        classNames={{
          track: styles.track,
          thumb: styles.thumb,
        }}
        aria-label={isHebrew ? t('language.he') : t('language.en')}
      />
      <span className={styles.label}>{t('language.he')}</span>
    </div>
  )
}
