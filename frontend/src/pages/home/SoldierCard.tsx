import { Card, Box, Text } from '@mantine/core'
import type { Soldier } from '../../types'
import styles from './SoldierCard.module.css'

interface SoldierCardProps {
  soldier: Soldier | null
}

export function SoldierCard({ soldier }: SoldierCardProps) {
  if (!soldier) return null
  const photoUrl = soldier.photo_url || 'placeholder-soldier.svg'
  const src = photoUrl.startsWith('/') ? photoUrl : `/images/${photoUrl}`
  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      className={styles.card}
    >
      <Box
        className={styles.photo}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={`Portrait of ${soldier.name}`}
      />
      <Text fw={700} size="xs" c="dark.8" mt="xs" lineClamp={1}>
        {soldier.name}
      </Text>
      <Text size="xs" c="dimmed" fw={600} lineClamp={1}>
        {soldier.rank}
      </Text>
    </Card>
  )
}
