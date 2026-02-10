import { Box, Container } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import type { Soldier } from '../../types'
import { getHeroSoldier, getFeaturedSoldiers } from '../../api/http'
import { SoldierCard } from './SoldierCard'
import { FeaturedSoldiersRow } from './FeaturedSoldiersRow'
import { HomeSectionHeader } from './HomeSectionHeader'
import styles from './HomePage.module.css'

export function HomePage() {
  const { data: heroSoldier = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'hero'],
    queryFn: getHeroSoldier,
  })
  const { data: featuredList = [] } = useQuery<Soldier[]>({
    queryKey: ['soldiers', 'featured'],
    queryFn: getFeaturedSoldiers,
  })

  return (
    <Box className={styles.root}>
      <Box aria-hidden className={styles.overlay} />
      <Container w="100%">
        <HomeSectionHeader />
        <Box className={styles.heroContainer} >
          <SoldierCard soldier={heroSoldier} />
        </Box>
      </Container>
      <Container size="xl" py="xl" pos="relative">
        <FeaturedSoldiersRow soldiers={featuredList} />
      </Container>
    </Box>
  )
}
