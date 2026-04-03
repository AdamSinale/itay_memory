import { Box } from '@mantine/core'
import type { Soldier } from '../../types'
import { SoldierCard } from '../../components/SoldierCard'
import styles from './FeaturedSoldiersRow.module.css'

interface FeaturedSoldiersRowProps {
  soldiers: Soldier[]
  skipFirst?: number
}

export function FeaturedSoldiersRow({ soldiers }: FeaturedSoldiersRowProps) {
  if (soldiers.length === 0) return null

  return (
    <Box mb="xl" className={styles.row}>
      {soldiers.map((soldier, index) => (
        <SoldierCard
          key={soldier.id}
          soldier={soldier}
          showBirthday={index === 0}
          showMemorialDay={index === soldiers.length - 1}
        />
      ))}
    </Box>
  )
}
