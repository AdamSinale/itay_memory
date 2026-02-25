import { Box, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import styles from './AboutPage.module.css'
import honorImage from './honorImage.png'
import memoryImage from './memoryImage.png'
import supportImage from './supportImage.png'
import progressImage from './progressImage.png'
import planImage from './planImage.png'

export function CommunitySubjects() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <Box className={styles.subjects}>
      <Box className={styles.subject}>
        <Text className={styles.subjectText}>{isHe ? 'תמיכה' : 'Support'}</Text>
        <img src={supportImage} alt="Support" className={styles.subjectImage} />
      </Box>
      <Box className={styles.subject}>
        <Text className={styles.subjectText}>{isHe ? 'זיכרון' : 'Memory'}</Text>
        <img src={memoryImage} alt="Memory" className={styles.subjectImage} />
      </Box>
      <Box className={styles.subject}>
        <Text className={styles.subjectText}>{isHe ? 'התקדמות' : 'Progress'}</Text>
        <img src={progressImage} alt="Progress" className={styles.subjectImage} />
      </Box>
      <Box className={styles.subject}>
        <Text className={styles.subjectText}>{isHe ? 'כבוד' : 'Honor'}</Text>
        <img src={honorImage} alt="Honor" className={styles.subjectImage} />
      </Box>
      <Box className={styles.subject}>
        <Text className={styles.subjectText}>{isHe ? 'תכנית' : 'Plan'}</Text>
        <img src={planImage} alt="Plan" className={styles.subjectImage} />
      </Box>
    </Box>
  )
}
