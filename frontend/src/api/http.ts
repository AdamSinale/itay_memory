import axios from 'axios'
import { API_URL } from '../config'
import type { Soldier } from '../types'

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getHeroSoldier(): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>('/soldiers/hero')
    return res.data
  } catch {
    return null
  }
}

export async function getFeaturedSoldiers(): Promise<Soldier[]> {
  try {
    const res = await http.get<Soldier[]>('/soldiers/featured')
    return res.data ?? []
  } catch {
    return []
  }
}

export async function getRandomSoldiers(
  limit: number,
  excludeIds?: string[]
): Promise<Soldier[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) })
    if (excludeIds?.length) {
      params.set('exclude', excludeIds.join(','))
    }
    const res = await http.get<Soldier[]>(`/soldiers/random?${params}`)
    return res.data ?? []
  } catch {
    return []
  }
}

export async function getClosestBirthdaySoldier(): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>('/soldiers/closest-birthday')
    return res.data
  } catch {
    return null
  }
}

export async function getClosestMemorialSoldier(): Promise<Soldier | null> {
  try {
    const res = await http.get<Soldier>('/soldiers/closest-memorial')
    return res.data
  } catch {
    return null
  }
}
