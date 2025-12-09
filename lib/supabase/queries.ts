import { supabase } from './client'
import type { 
  RomanticMemory, 
  SpecialDay, 
  Quote, 
  InsertRomanticMemory, 
  InsertSpecialDay, 
  InsertQuote,
  UpdateRomanticMemory,
  UpdateSpecialDay,
  UpdateQuote
} from '@/lib/types'

// Romantic Memories
export async function getMemories() {
  const { data, error } = await supabase
    .from('romantic_memories')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as RomanticMemory[]
}

export async function getRecentMemories(limit = 5) {
  const { data, error } = await supabase
    .from('romantic_memories')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as RomanticMemory[]
}

export async function createMemory(memory: InsertRomanticMemory) {
  const { data, error } = await supabase
    .from('romantic_memories')
    .insert(memory)
    .select()
    .single()

  if (error) throw error
  return data as RomanticMemory
}

export async function updateMemory(id: string, updates: UpdateRomanticMemory) {
  const { data, error } = await supabase
    .from('romantic_memories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as RomanticMemory
}

export async function deleteMemory(id: string) {
  const { error } = await supabase
    .from('romantic_memories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Special Days
export async function getSpecialDays() {
  const { data, error } = await supabase
    .from('special_days')
    .select('*')
    .order('date', { ascending: true })

  if (error) throw error
  return data as SpecialDay[]
}

export async function createSpecialDay(specialDay: InsertSpecialDay) {
  const { data, error } = await supabase
    .from('special_days')
    .insert(specialDay)
    .select()
    .single()

  if (error) throw error
  return data as SpecialDay
}

export async function updateSpecialDay(id: string, updates: UpdateSpecialDay) {
  const { data, error } = await supabase
    .from('special_days')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as SpecialDay
}

export async function deleteSpecialDay(id: string) {
  const { error } = await supabase
    .from('special_days')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Quotes
export async function getQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as Quote[]
}

export async function getRandomQuote() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('RANDOM()')
    .limit(1)
    .single()

  if (error) throw error
  return data as Quote
}

export async function createQuote(quote: InsertQuote) {
  const { data, error } = await supabase
    .from('quotes')
    .insert(quote)
    .select()
    .single()

  if (error) throw error
  return data as Quote
}

export async function updateQuote(id: string, updates: UpdateQuote) {
  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Quote
}

export async function deleteQuote(id: string) {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Photos
export async function getPhotos() {
  const { data, error } = await supabase
    .from('romantic_memories')
    .select('*')
    .eq('type', 'photo')
    .not('image_url', 'is', null)
    .order('date', { ascending: false })

  if (error) throw error
  return data as RomanticMemory[]
}

export async function uploadPhoto(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(fileName, file)

  if (error) throw error
  return data
}

export async function getPhotoUrl(path: string) {
  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(path)

  return data.publicUrl
}

// Statistics
export async function getDashboardStats() {
  const [memoriesResult, quotesResult, specialDaysResult, photosResult] = await Promise.all([
    supabase.from('romantic_memories').select('id', { count: 'exact', head: true }),
    supabase.from('quotes').select('id', { count: 'exact', head: true }),
    supabase.from('special_days').select('id', { count: 'exact', head: true }),
    supabase.from('romantic_memories').select('id', { count: 'exact', head: true }).eq('type', 'photo').not('image_url', 'is', null)
  ])

  return {
    memories: memoriesResult.count || 0,
    quotes: quotesResult.count || 0,
    specialDays: specialDaysResult.count || 0,
    photos: photosResult.count || 0
  }
}