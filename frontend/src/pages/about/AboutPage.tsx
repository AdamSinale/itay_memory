import { Box, Container, Title, Text, Group } from '@mantine/core'
import { IconFlag, IconCandle, IconStar } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../../config'
import type { AboutData } from '../../types'
import { DonationBox } from './DonationBox'
import styles from './AboutPage.module.css'

const GOLD = '#b8962e'

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

  return (
    <Box className={styles.root}>
      <Box py="xl" px="md" className={styles.banner}>
        <Container size="md">
          <Title order={1} ta="center" c="dark.8" mb="xs" className={styles.bannerTitle}>
            {isHe ? 'ערך עיה' : 'Purpose of the Foundation'}
          </Title>
          {isHe && (
            <Text ta="center" size="sm" c="dark.5" tt="uppercase" fw={600} className={styles.bannerSubtitleEn}>
              Purpose of the Foundation
            </Text>
          )}
          {!isHe && (
            <Text ta="center" size="sm" c="dark.5" className={styles.bannerSubtitleHe}>
              ערך עיה
            </Text>
          )}
        </Container>
      </Box>

      <Container size="md" py="xl">
        <Group justify="center" gap="xl" mb="xl" wrap="wrap">
          <Box className={styles.iconWrap}>
            <IconFlag size={36} color={GOLD} stroke={1.5} />
          </Box>
          <Box className={styles.iconWrap}>
            <IconCandle size={36} color={GOLD} stroke={1.5} />
          </Box>
          <Box className={styles.iconWrap}>
            <IconStar size={36} color={GOLD} stroke={1.5} />
          </Box>
        </Group>

        <Box mb="xl" p="xl" className={styles.missionBox}>
          <Text size="lg" c="dark.7" className={styles.missionText} style={{ textAlign: isHe ? 'right' : 'left' }}>
            {missionText}
          </Text>
        </Box>

        <Box id="donate">
          <DonationBox donationPhone={about?.donation_phone ?? null} />
        </Box>
      </Container>
    </Box>
  )
}
