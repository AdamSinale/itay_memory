import axios from 'axios'
import { API_URL } from '../config'
import type { Soldier } from '../types'

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getHeroSoldier(lang: string = 'he'): Promise<Soldier | null> {
  try {
    console.info('Getting hero soldier')
    const res = await http.get<Soldier>(`/soldiers/hero?lang=${lang}`)
    return res.data
  } catch {
    console.error('Failed to get hero soldier')
    return null
  }
}

export async function getRandomSoldiers(
  limit: number,
  lang: string = 'he',
  excludeIds?: string[]
): Promise<Soldier[]> {
  try {
    console.info('Getting random soldiers')
    const params = new URLSearchParams({ limit: String(limit), lang })
    if (excludeIds?.length) {
      params.set('exclude', excludeIds.join(','))
    }
    const res = await http.get<Soldier[]>(`/soldiers/random?${params}`)
    return res.data ?? []
  } catch {
    console.error('Failed to get random soldiers')
    return []
  }
}

export async function getClosestBirthdaySoldier(lang: string = 'he'): Promise<Soldier | null> {
  try {
    console.info('Getting closest birthday soldier')
    const res = await http.get<Soldier>(`/soldiers/closest-birthday?lang=${lang}`)
    return res.data
  } catch {
    console.error('Failed to get closest birthday soldier')
    return null
  }
}

export async function getClosestMemorialSoldier(lang: string = 'he'): Promise<Soldier | null> {
  try {
    console.info('Getting closest memorial soldier')
    const res = await http.get<Soldier>(`/soldiers/closest-memorial?lang=${lang}`)
    return res.data
  } catch {
    console.error('Failed to get closest memorial soldier')
    return null
  }
}

export interface SoldierSearchParams {
  name?: string
  gender?: string
  age_min?: number
  age_max?: number
  memorial_from?: string
  memorial_to?: string
  rank?: string
  unit?: string
}

export async function searchSoldiers(
  lang: string,
  params: SoldierSearchParams,
): Promise<Soldier[]> {
  try {
    const sp = new URLSearchParams({ lang })
    if (params.name?.trim()) sp.set('name', params.name.trim())
    if (params.gender?.trim()) sp.set('gender', params.gender.trim())
    if (params.age_min != null) sp.set('age_min', String(params.age_min))
    if (params.age_max != null) sp.set('age_max', String(params.age_max))
    if (params.memorial_from?.trim()) sp.set('memorial_from', params.memorial_from.trim())
    if (params.memorial_to?.trim()) sp.set('memorial_to', params.memorial_to.trim())
    if (params.rank?.trim()) sp.set('rank', params.rank.trim())
    if (params.unit?.trim()) sp.set('unit', params.unit.trim())
    const res = await http.get<Soldier[]>(`/soldiers?${sp}`)
    return res.data ?? []
  } catch {
    console.error('Failed to search soldiers')
    return []
  }
}

export async function getSoldierById(id: string, lang: string = 'he'): Promise<Soldier | null> {
  try {
    console.info('Getting soldier by id')
    const res = await http.get<Soldier>(`/soldiers/${id}?lang=${lang}`)
    return res.data
  } catch {
    console.error('Failed to get soldier by id')
    return null
  }
}

export async function createSoldier(formData: FormData, isHebrew: boolean): Promise<Soldier> {
  const res = await axios.post<Soldier>(`${http.defaults.baseURL}/soldiers?isHebrew=${isHebrew}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
