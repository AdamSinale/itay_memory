import { Box, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import styles from './AboutPage.module.css'
import aboutPageImage from './AboutPage.png'
import generalInfo from './generalInfo.json'

export function GeneralInfo() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'he' ? 'he' : 'en'
  const content = generalInfo[lang as keyof typeof generalInfo]

  return (
    <Box className={styles.headerContent}>
      <img src={aboutPageImage} alt="" className={styles.headerImage} />
      <div className={styles.headerText}>
        <Title className={styles.mainTitle}>{content.mainTitle}</Title>
        <Text className={styles.subtitle}>{content.subtitle}</Text>
        <Text className={styles.description}>{content.description}</Text>
      </div>
    </Box>
  )
}
