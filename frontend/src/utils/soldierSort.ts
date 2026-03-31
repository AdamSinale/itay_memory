import { RANK_OPTIONS } from '../constants/ranks'
import type { Soldier } from '../types'

export type SortField = 'name' | 'age' | 'rank' | 'unit' | 'memorial'

function parseLocalDate(s: string): Date {
  const [y, mo, d] = s.split('T')[0].split('-').map(Number)
  return new Date(y, mo - 1, d)
}

function getAgeAtMemorial(s: Soldier): number | null {
  if (!s.birth_date || !s.memorial_date) return null
  const b = parseLocalDate(s.birth_date)
  const m = parseLocalDate(s.memorial_date)
  let age = m.getFullYear() - b.getFullYear()
  const mPart = m.getMonth() * 100 + m.getDate()
  const bPart = b.getMonth() * 100 + b.getDate()
  if (mPart < bPart) age -= 1
  return age
}

function rankOrder(rank: string): number {
  const i = RANK_OPTIONS.findIndex((r) => r.value === rank)
  return i >= 0 ? i : 9999
}

export function sortSoldiers(
  list: Soldier[],
  field: SortField,
  dir: 'asc' | 'desc',
  lang: 'he' | 'en',
): Soldier[] {
  const mult = dir === 'asc' ? 1 : -1
  const locale = lang === 'he' ? 'he' : 'en'

  return [...list].sort((a, b) => {
    let cmp = 0
    switch (field) {
      case 'name':
        cmp = a.name.localeCompare(b.name, locale, { sensitivity: 'base' })
        break
      case 'unit':
        cmp = a.unit.localeCompare(b.unit, locale, { sensitivity: 'base' })
        break
      case 'memorial': {
        const ta = a.memorial_date ? parseLocalDate(a.memorial_date).getTime() : NaN
        const tb = b.memorial_date ? parseLocalDate(b.memorial_date).getTime() : NaN
        if (Number.isNaN(ta) && Number.isNaN(tb)) cmp = 0
        else if (Number.isNaN(ta)) cmp = 1
        else if (Number.isNaN(tb)) cmp = -1
        else cmp = ta - tb
        break
      }
      case 'age': {
        const ageA = getAgeAtMemorial(a)
        const ageB = getAgeAtMemorial(b)
        if (ageA === null && ageB === null) cmp = 0
        else if (ageA === null) cmp = 1
        else if (ageB === null) cmp = -1
        else cmp = ageA - ageB
        break
      }
      case 'rank': {
        const oa = rankOrder(a.rank)
        const ob = rankOrder(b.rank)
        cmp = oa !== ob ? oa - ob : a.rank.localeCompare(b.rank, 'he')
        break
      }
      default:
        cmp = 0
    }
    return mult * cmp
  })
}
