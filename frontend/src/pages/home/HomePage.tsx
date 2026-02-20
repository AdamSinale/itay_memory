import { Box, Container } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
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
  const { i18n } = useTranslation()
  const lang = i18n.language === 'he' ? 'he' : 'en'

  const { data: heroSoldier = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'hero', lang],
    queryFn: () => getHeroSoldier(lang),
  })
  const { data: closestBd = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'closest-birthday', lang],
    queryFn: () => getClosestBirthdaySoldier(lang),
  })
  const { data: closestMemorial = null } = useQuery<Soldier | null>({
    queryKey: ['soldiers', 'closest-memorial', lang],
    queryFn: () => getClosestMemorialSoldier(lang),
  })

  const excludeIds = useMemo(() => {
    const ids: string[] = []
    if (closestBd?.id) ids.push(String(closestBd.id))
    if (closestMemorial?.id) ids.push(String(closestMemorial.id))
    if (heroSoldier?.id) ids.push(String(heroSoldier.id))
    return ids
  }, [closestBd?.id, closestMemorial?.id, heroSoldier])

  const excludeKey = excludeIds.join(',')

  const { data: twoOthers = [] } = useQuery<Soldier[]>({
    queryKey: ['soldiers', 'random', 4, excludeKey, lang],
    queryFn: () => getRandomSoldiers(4, lang, excludeIds.length > 0 ? excludeIds : undefined),
    enabled: true,
  })

  const featuredList = useMemo(() => {
    const list: Soldier[] = []
    if (closestBd) list.push(closestBd)
    list.push(...twoOthers)
    if (closestMemorial) list.push(closestMemorial)
    return list
  }, [closestBd, heroSoldier, twoOthers, closestMemorial])

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
