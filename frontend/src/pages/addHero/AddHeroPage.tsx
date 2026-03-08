import { useNavigate } from 'react-router-dom'
import { Box } from '@mantine/core'
import { AddHeroForm } from './AddHeroForm'
import styles from './AddHeroPage.module.css'

export function AddHeroPage() {
  const navigate = useNavigate()

  return (
    <Box className={styles.root}>
      <AddHeroForm isHebrew={true} onSuccess={(soldier) => navigate(`/soldier/${soldier.id}`)} />
      <AddHeroForm isHebrew={false} onSuccess={(soldier) => navigate(`/soldier/${soldier.id}`)} />
    </Box>
  )
}
