import { Card, Box, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { Soldier } from '../types'
import { Link } from 'react-router-dom'
import styles from './SoldierCard.module.css'

interface SoldierCardProps {
  soldier: Soldier | null
  showBirthday?: boolean
  showMemorialDay?: boolean
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function SoldierCard({
  soldier,
  showBirthday = false,
  showMemorialDay = false,
}: SoldierCardProps) {
  const { i18n } = useTranslation()
  const isHebrew = i18n.language === 'he'
  const locale = isHebrew ? 'he-IL' : 'en-US'
  if (!soldier) return null
  const birthFormatted = showBirthday ? formatDate(soldier.birth_date, locale) : null
  const memorialFormatted = showMemorialDay ? formatDate(soldier.memorial_date, locale) : null
  return (
    <Card className={styles.card}>
      <Link to={`/soldier/${soldier.id}`} className={styles.link}></Link>
      <Box className={styles.photoContainer}>
        <Box className={styles.framePhotoBG} />
        <Box className={styles.soldierPhoto} style={{ backgroundImage: `url(${soldier.photo_url})` }} />
        <Box className={styles.framePhoto} />
      </Box>
      <Box className={styles.infoContainer}>
        <Text fw={700} size="24px" lineClamp={1}>
          {soldier.rank}
          <br />
          <span>{soldier.name}</span>
        </Text>
        <Text fw={600} lineClamp={1} className="metaText">
          {birthFormatted && `${isHebrew ? 'יום הולדת' : 'Birthday'}:`}
        </Text>
        <Text fw={600} lineClamp={1} className="metaText">
          {birthFormatted && birthFormatted}
        </Text>
        <Text fw={600} lineClamp={1} className="metaText">
          {memorialFormatted && `${isHebrew ? 'יום זכרו נפל' : 'Memorial Day'}:`}
        </Text>
        <Text fw={600} lineClamp={1} className="metaText">
          {memorialFormatted && memorialFormatted}
        </Text>
      </Box>
    </Card>
  )
}
