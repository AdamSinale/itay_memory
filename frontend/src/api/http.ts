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
  console.log(formData.get('name'))
  console.log(formData.get('rank'))
  console.log(formData.get('unit'))
  console.log(formData.get('birth_date'))
  console.log(formData.get('memorial_date'))
  console.log(formData.get('gender'))
  console.log(formData.get('photo'))
  const res = await axios.post<Soldier>(`${http.defaults.baseURL}/soldiers?isHebrew=${isHebrew}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
