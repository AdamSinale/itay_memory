import axios from 'axios'
import { API_URL } from '../config'
import type { Soldier } from '../types'

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getHeroSoldier(lang: string = 'he'): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>(`/soldiers/hero?lang=${lang}`)
    return res.data
  } catch {
    return null
  }
}

export async function getRandomSoldiers(
  limit: number,
  lang: string = 'he',
  excludeIds?: string[]
): Promise<Soldier[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit), lang })
    if (excludeIds?.length) {
      params.set('exclude', excludeIds.join(','))
    }
    const res = await http.get<Soldier[]>(`/soldiers/random?${params}`)
    return res.data ?? []
  } catch {
    return []
  }
}

export async function getClosestBirthdaySoldier(lang: string = 'he'): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>(`/soldiers/closest-birthday?lang=${lang}`)
    return res.data
  } catch {
    return null
  }
}

export async function getClosestMemorialSoldier(lang: string = 'he'): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>(`/soldiers/closest-memorial?lang=${lang}`)
    return res.data
  } catch {
    return null
  }
}

export async function getSoldierById(id: string, lang: string = 'he'): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>(`/soldiers/${id}?lang=${lang}`)
    return res.data
  } catch {
    return null
  }
}
