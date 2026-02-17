import { Box, Container } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Soldier } from '../../types'
import {
  getHeroSoldier,
  getClosestBirthdaySoldier,
  getClosestMemorialSoldier,
  getRandomSoldiers,
} from '../../api/http'
import { SoldierCard } from './SoldierCard'
import { FeaturedSoldiersRow } from './FeaturedSoldiersRow'
import { HomeSectionHeader } from './HomeSectionHeader'
import styles from './HomePage.module.css'

export function HomePage() {
  const { data: heroSoldier = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'hero'],
    queryFn: getHeroSoldier,
  })
  const { data: closestBd = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'closest-birthday'],
    queryFn: getClosestBirthdaySoldier,
  })
  const { data: closestMemorial = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'closest-memorial'],
    queryFn: getClosestMemorialSoldier,
  })
  const { data: featuredOne = [] } = useQuery<Soldier[]>({
    queryKey: ['soldiers', 'random', 1],
    queryFn: () => getRandomSoldiers(1),
  })

  const excludeIds = useMemo(() => {
    const ids: string[] = []
    if (closestBd?.id) ids.push(String(closestBd.id))
    if (closestMemorial?.id) ids.push(String(closestMemorial.id))
    if (featuredOne[0]?.id) ids.push(String(featuredOne[0].id))
    return ids
  }, [closestBd?.id, closestMemorial?.id, featuredOne])

  const excludeKey = excludeIds.join(',')

  const { data: twoOthers = [] } = useQuery<Soldier[]>({
    queryKey: ['soldiers', 'random', 2, excludeKey],
    queryFn: () => getRandomSoldiers(2, excludeIds.length > 0 ? excludeIds : undefined),
    enabled: true,
  })

  const featuredList = useMemo(() => {
    const list: Soldier[] = []
    if (closestBd) list.push(closestBd)
    if (featuredOne[0]) list.push(featuredOne[0])
    list.push(...twoOthers)
    if (closestMemorial) list.push(closestMemorial)
    return list
  }, [closestBd, featuredOne, twoOthers, closestMemorial])

  return (
    <Box className={styles.root}>
      <Container className={styles.heroSection}>
        <HomeSectionHeader />
        <Box className={styles.heroContainer}>
          <SoldierCard soldier={heroSoldier} />
        </Box>
      </Container>
      <Container className={styles.featuredSection}>
        <FeaturedSoldiersRow soldiers={featuredList} />
      </Container>
    </Box>
  )
}
