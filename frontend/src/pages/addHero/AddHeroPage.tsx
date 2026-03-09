import { useNavigate } from 'react-router-dom'
import { Box } from '@mantine/core'
import { AddHeroForm } from './AddHeroForm'
import { useTranslation } from 'react-i18next'
import styles from './AddHeroPage.module.css'

export function AddHeroPage() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box className={styles.root}>
      <AddHeroForm isHebrew={i18n.language === 'he'} onSuccess={(soldier) => navigate(`/soldier/${soldier.id}`)} />
    </Box>
  )
}
