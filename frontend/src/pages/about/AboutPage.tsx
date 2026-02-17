import { Box, Container, Title, Text, Group, Stack, Paper } from '@mantine/core'
import { IconFlag, IconCandle, IconStar } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../../config'
import type { AboutData } from '../../types'
import { DonationBox } from './DonationBox'
import styles from './AboutPage.module.css'
import aboutPageImage from './AboutPage.png'

export function AboutPage() {
  const { i18n, t } = useTranslation()
  const isHe = i18n.language === 'he'
  const { data: about } = useQuery<AboutData | null>({
    queryKey: ['about'],
    queryFn: () => fetch(`${API_URL}/about`).then((r) => r.json()),
  })

  const missionText = about
    ? (isHe ? about.mission_text_he : about.mission_text_en) || t('about.mission_fallback')
    : t('about.mission_fallback')

  const iconItems = [
    { Icon: IconFlag, label: isHe ? 'כבוד' : 'Honor' },
    { Icon: IconCandle, label: isHe ? 'זיכרון' : 'Memory' },
    { Icon: IconStar, label: isHe ? 'תמיכה' : 'Support' },
  ]

  return (
    <Box className={styles.root}>
      <header className={styles.articleHeader}>
        <img src={aboutPageImage} alt="" className={styles.headerImage} />
        <Box className={styles.headerContent}>
          <Title order={1} ta="center" className={styles.mainTitle}>
            {isHe ? 'מטרת העמותה' : 'Purpose of the Foundation'}
          </Title>
          <Text size="lg" c="dark.6" ta="center" mt="md" className={styles.subtitle}>
            {isHe ? 'לזכור, לכבד ולתמוך' : 'Remember, Honor, Support'}
          </Text>
          {/* Icons Section */}
          <Group justify="center" gap="xl" wrap="wrap" className={styles.iconsSection}>
            {iconItems.map(({ Icon, label }, index) => (
              <Paper key={index} p="lg" className={styles.iconCard} withBorder>
                <Stack align="center" gap="sm">
                  <Box className={styles.iconWrapper}>
                    <Icon size={32} stroke={2} />
                  </Box>
                  <Text size="sm" fw={600} c="dark.7">
                    {label}
                  </Text>
                </Stack>
              </Paper>
            ))}
          </Group>
        </Box>
      </header>

      <Box className={styles.contentSection}>
        <Container size="lg" py="xl">
          <Stack gap="xl">

          {/* Mission Section */}
          <Paper p="xl" className={styles.missionBox} withBorder>
            <Text size="lg" c="dark.8" className={styles.missionText} style={{ textAlign: isHe ? 'right' : 'left' }}>
              {missionText}
            </Text>
          </Paper>

          {/* Donation Section */}
          <Box id="donate">
            <DonationBox donationPhone={about?.donation_phone ?? null} />
          </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
