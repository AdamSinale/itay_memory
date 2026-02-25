import { Box, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import styles from './AboutPage.module.css'
import aboutPageImage from './AboutPage.png'

export function GeneralInfo() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <Box className={styles.headerContent}>
      <img src={aboutPageImage} alt="" className={styles.headerImage} />
      <div className={styles.headerText}>
        <Title className={styles.mainTitle}>
          {isHe ? 'קהילת איתי' : 'Itay Community'}
        </Title>
        <Text className={styles.subtitle}>
          {isHe ? 'מטרת העמותה' : 'Purpose of the Foundation'}
        </Text>
        <Text className={styles.description}>
          {isHe
            ? 'קהילת איתי היא קהילה של משפחות של גיבורים שנופלו במלחמה.'
            : 'Itay Community is a community of families of heroes who fell in battle. We are here to support them and their families.'}
        </Text>
      </div>
    </Box>
  )
}
