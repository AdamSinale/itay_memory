import { useMemo, useState } from 'react'
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  NumberInput,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  IconArrowsSort,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react'
import { searchSoldiers } from '../../api/http'
import { RANK_OPTIONS } from '../../constants/ranks'
import type { Soldier } from '../../types'
import { sortSoldiers, type SortField } from '../../utils/soldierSort'
import { FormSelect } from '../../components/FormSelect'
import { SoldierCard } from '../home/SoldierCard'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'he' ? 'he' : 'en'
  const isHe = lang === 'he'

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [debouncedName] = useDebouncedValue(name, 320)
  const [debouncedUnit] = useDebouncedValue(unit, 320)

  const [gender, setGender] = useState<string | null>(null)
  const [rank, setRank] = useState<string | null>(null)
  const [ageMin, setAgeMin] = useState<number | string>('')
  const [ageMax, setAgeMax] = useState<number | string>('')
  const [memorialFrom, setMemorialFrom] = useState('')
  const [memorialTo, setMemorialTo] = useState('')

  const queryParams = useMemo(() => {
    const amin =
      ageMin === '' || ageMin === undefined ? undefined : Number(ageMin)
    const amax =
      ageMax === '' || ageMax === undefined ? undefined : Number(ageMax)
    return {
      name: debouncedName || undefined,
      unit: debouncedUnit || undefined,
      gender: gender ?? undefined,
      rank: rank ?? undefined,
      age_min: Number.isFinite(amin as number) ? amin : undefined,
      age_max: Number.isFinite(amax as number) ? amax : undefined,
      memorial_from: memorialFrom || undefined,
      memorial_to: memorialTo || undefined,
    }
  }, [
    debouncedName,
    debouncedUnit,
    gender,
    rank,
    ageMin,
    ageMax,
    memorialFrom,
    memorialTo,
  ])

  const queryKey = useMemo(
    () => ['soldiers', 'search', lang, queryParams] as const,
    [lang, queryParams],
  )

  const { data: soldiers = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => searchSoldiers(lang, queryParams),
  })

  const sortedSoldiers = useMemo(
    () => sortSoldiers(soldiers, sortField, sortDir, lang),
    [soldiers, sortField, sortDir, lang],
  )

  const rankData = useMemo(
    () =>
      RANK_OPTIONS.map((r) => ({
        value: r.value,
        label: isHe ? r.labelHe : r.labelEn,
      })),
    [isHe],
  )

  const genderData = useMemo(
    () => [
      { value: 'זכר', label: t('search.male') },
      { value: 'נקבה', label: t('search.female') },
    ],
    [t],
  )

  const sortFieldOptions = useMemo(
    () => [
      { value: 'name', label: t('search.sortName') },
      { value: 'age', label: t('search.sortAge') },
      { value: 'rank', label: t('search.sortRank') },
      { value: 'unit', label: t('search.sortUnit') },
      { value: 'memorial', label: t('search.sortMemorial') },
    ],
    [t],
  )

  const clearFilters = () => {
    setName('')
    setUnit('')
    setGender(null)
    setRank(null)
    setAgeMin('')
    setAgeMax('')
    setMemorialFrom('')
    setMemorialTo('')
  }

  const toggleSortDir = () => {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <Box className={styles.root}>
      <Container size="xl" py="xl">
        <Flex
          justify="space-between"
          align="center"
          gap="md"
          wrap="wrap"
          mb="md"
          className={styles.headerRow}
        >
          <Title order={1} c="dark.8" className={styles.pageTitle}>
            {t('search.title')}
          </Title>
          <Group gap="xs">
            <ActionIcon
              size="lg"
              variant={filtersOpen ? 'filled' : 'light'}
              color="gold"
              radius="md"
              aria-expanded={filtersOpen}
              aria-label={t('search.filterToggle')}
              title={t('search.filterToggle')}
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <IconFilter size={22} stroke={1.75} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              variant={sortOpen ? 'filled' : 'light'}
              color="gold"
              radius="md"
              aria-expanded={sortOpen}
              aria-label={t('search.sortToggle')}
              title={t('search.sortToggle')}
              onClick={() => setSortOpen((o) => !o)}
            >
              <IconArrowsSort size={22} stroke={1.75} />
            </ActionIcon>
          </Group>
        </Flex>

        {filtersOpen && (
          <Paper p="md" radius="md" className={styles.filters} mb="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <TextInput
                  label={t('search.name')}
                  placeholder={t('search.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <FormSelect
                  variant="compact"
                  label={t('search.gender')}
                  placeholder={t('search.anyGender')}
                  value={gender ?? ''}
                  onChange={(v) => setGender(v || null)}
                  options={genderData}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <FormSelect
                  variant="compact"
                  label={t('search.rank')}
                  placeholder={t('search.allRanks')}
                  value={rank ?? ''}
                  onChange={(v) => setRank(v || null)}
                  options={rankData}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <TextInput
                  label={t('search.unit')}
                  placeholder={t('search.unitPlaceholder')}
                  value={unit}
                  onChange={(e) => setUnit(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
                <NumberInput
                  label={t('search.ageMin')}
                  placeholder="—"
                  min={0}
                  max={130}
                  value={ageMin === '' ? undefined : ageMin}
                  onChange={setAgeMin}
                  allowDecimal={false}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
                <NumberInput
                  label={t('search.ageMax')}
                  placeholder="—"
                  min={0}
                  max={130}
                  value={ageMax === '' ? undefined : ageMax}
                  onChange={setAgeMax}
                  allowDecimal={false}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 6, md: 4 }}>
                <TextInput
                  label={t('search.memorialFrom')}
                  type="date"
                  value={memorialFrom}
                  onChange={(e) => setMemorialFrom(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 6, md: 4 }}>
                <TextInput
                  label={t('search.memorialTo')}
                  type="date"
                  value={memorialTo}
                  onChange={(e) => setMemorialTo(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 12, md: 4 }} mt="auto">
                <Button variant="light" color="gold" onClick={clearFilters} fullWidth>
                  {t('search.clear')}
                </Button>
              </Grid.Col>
            </Grid>
          </Paper>
        )}

        {sortOpen && (
          <Paper p="md" radius="md" className={styles.sortPanel} mb="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 5 }}>
                <FormSelect
                  variant="compact"
                  label={t('search.sortBy')}
                  value={sortField}
                  onChange={(v) => setSortField(v as SortField)}
                  options={sortFieldOptions}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 7 }}>
                <Text size="sm" fw={500} mb={6}>
                  {t('search.sortDirection')}
                </Text>
                <Group gap="xs">
                  <ActionIcon
                    size="xl"
                    variant={sortDir === 'asc' ? 'filled' : 'light'}
                    color="gold"
                    radius="md"
                    aria-pressed={sortDir === 'asc'}
                    aria-label={t('search.sortAsc')}
                    title={t('search.sortAsc')}
                    onClick={() => setSortDir('asc')}
                  >
                    <IconSortAscending size={22} stroke={1.75} />
                  </ActionIcon>
                  <ActionIcon
                    size="xl"
                    variant={sortDir === 'desc' ? 'filled' : 'light'}
                    color="gold"
                    radius="md"
                    aria-pressed={sortDir === 'desc'}
                    aria-label={t('search.sortDesc')}
                    title={t('search.sortDesc')}
                    onClick={() => setSortDir('desc')}
                  >
                    <IconSortDescending size={22} stroke={1.75} />
                  </ActionIcon>
                  <Button variant="subtle" size="xs" onClick={toggleSortDir}>
                    {t('search.sortOpposite')}
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        )}

        <Text size="sm" c="dimmed" mt="md">
          {isLoading ? t('search.loading') : t('search.count', { count: sortedSoldiers.length })}
        </Text>

        {!isLoading && sortedSoldiers.length === 0 ? (
          <Text c="dimmed" mt="xl">
            {t('search.noResults')}
          </Text>
        ) : (
          <Box className={styles.grid}>
            {sortedSoldiers.map((s: Soldier) => (
              <Box key={s.id} className={styles.cardWrap}>
                <SoldierCard soldier={s} showBirthday showMemorialDay />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}
