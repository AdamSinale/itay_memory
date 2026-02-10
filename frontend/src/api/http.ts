import axios from 'axios'
import { API_URL } from '../config'
import type { Soldier } from '../types'

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getHeroSoldier(): Promise<Soldier | null> {
  const res = await http.get<Soldier>('/soldiers/hero')
  return res.data
}

export async function getFeaturedSoldiers(): Promise<Soldier[]> {
  const res = await http.get<Soldier[]>('/soldiers/featured')
  return res.data
}
