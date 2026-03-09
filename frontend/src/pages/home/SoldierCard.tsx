import { Card, Box, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { Soldier } from '../../types'
import { Link } from 'react-router-dom'
import { API_URL } from '../../config'
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
  const locale = i18n.language === 'he' ? 'he-IL' : 'en-US'
  if (!soldier) return null
  const birthFormatted = showBirthday ? formatDate(soldier.birth_date, locale) : null
  const memorialFormatted = showMemorialDay ? formatDate(soldier.memorial_date, locale) : null
  return (
    <Card className={styles.card}>
      <Link to={`/soldier/${soldier.id}`} className={styles.link}></Link>
      <Box
        className={styles.photo}
        style={{ backgroundImage: `url(${soldier.photo_url})` }}
        role="img"
        aria-label={`Portrait of ${soldier.name}`}
      />
      <Text fw={700} size="xs" c="dark.8" mt="xs" lineClamp={1}>
        {soldier.name}
      </Text>
      <Text size="xs" c="dimmed" fw={600} lineClamp={1}>
        {soldier.rank}
      </Text>
      {birthFormatted && (
        <Text size="xs" c="dimmed" lineClamp={1}>
          {birthFormatted}
        </Text>
      )}
      {memorialFormatted && (
        <Text size="xs" c="dimmed" lineClamp={1}>
          {memorialFormatted}
        </Text>
      )}
    </Card>
  )
}
