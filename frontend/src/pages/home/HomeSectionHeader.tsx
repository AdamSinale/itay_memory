import { Box, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import styles from './HomeSectionHeader.module.css'

export function HomeSectionHeader() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <Box mb="xl" className={styles.wrapper} style={{ textAlign: isHe ? 'right' : 'left' }}>
      <Title order={2} c="dark.8" mb={4} className={styles.sectionTitle}>
        {isHe ? 'לזכר אהובנו איתי פריזט ז״ל' : 'In memory of our beloved Itay Parizat'}
      </Title>
      <Text size="sm" c="dark.5" tt="uppercase" className={styles.subtitle}>
         {isHe ? 'ושאר גיבורי ישראל שנפלו למעננו' : 'and the other heroes who fell for our sake.'}
      </Text>
    </Box>
  )
}
