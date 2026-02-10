import { Button, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()

  return (
    <Group gap="xs">
      <Button
        variant={i18n.language === 'he' ? 'filled' : 'light'}
        color="gold"
        size="sm"
        onClick={() => i18n.changeLanguage('he')}
      >
        {t('language.he')}
      </Button>
      <Button
        variant={i18n.language === 'en' ? 'filled' : 'light'}
        color="gold"
        size="sm"
        onClick={() => i18n.changeLanguage('en')}
      >
        {t('language.en')}
      </Button>
    </Group>
  )
}
