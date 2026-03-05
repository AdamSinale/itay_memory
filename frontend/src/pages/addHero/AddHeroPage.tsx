import { useNavigate } from 'react-router-dom'
import { Box } from '@mantine/core'
import { AddHeroFormHebrew, AddHeroFormEnglish } from './AddHeroForm'
import styles from './AddHeroPage.module.css'

export function AddHeroPage() {
  const navigate = useNavigate()

  return (
    <Box className={styles.root}>
      <AddHeroFormHebrew onSuccess={(soldier) => navigate(`/soldier/${soldier.id}`)} />
      <AddHeroFormEnglish onSuccess={(soldier) => navigate(`/soldier/${soldier.id}`)} />
    </Box>
  )
}
