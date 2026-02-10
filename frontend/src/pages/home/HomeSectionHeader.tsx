import { Box, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import styles from './HomeSectionHeader.module.css'

export function HomeSectionHeader() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <Box mb="xl" className={styles.wrapper} style={{ textAlign: isHe ? 'right' : 'left' }}>
      <Title order={2} c="dark.8" mb={4} className={styles.sectionTitle}>
        {isHe ? 'קהילת איתי' : 'Itay\'s Community'}
      </Title>
      {isHe ? (
        <Text size="sm" c="dark.5" className={styles.subtitleHe}>
          סיפורי גיבורינו
        </Text>
      ) : (
        <Text size="sm" c="dark.5" tt="uppercase" fw={600} className={styles.subtitleEn}>
          Stories of our Heroes
        </Text>
      )}
    </Box>
  )
}
