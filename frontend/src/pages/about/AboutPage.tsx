import { Box } from '@mantine/core'
import styles from './AboutPage.module.css'
import { GeneralInfo } from './GeneralInfo'
import { CommunitySubjects } from './CommunitySubjects'

export function AboutPage() {
  return (
    <Box className={styles.root}>
      <header className={styles.articleHeader}>
        <GeneralInfo />
        <CommunitySubjects />
      </header>
    </Box>
  )
}
