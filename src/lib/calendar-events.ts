import { supabase } from './supabase'
import type { EventColor } from '@/components/ui/calendar/types'

// Database types matching the Supabase table
export interface CalendarEventDB {
  id: string
  user_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  all_day: boolean
  location: string | null
  etiquette: EventColor
  created_at?: string
  updated_at?: string
}

// Convert DB format to app CalendarEvent format
export function fromDBToCalendarEvent(dbEvent: CalendarEventDB) {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || undefined,
    start: new Date(dbEvent.start_date),
    end: new Date(dbEvent.end_date),
    allDay: dbEvent.all_day,
    location: dbEvent.location || undefined,
    color: dbEvent.etiquette as EventColor,
  }
}

// Convert app CalendarEvent format to DB format
export function fromCalendarEventToDB(
  event: {
    id?: string
    title: string
    description?: string
    start: Date
    end: Date
    allDay?: boolean
    location?: string
    color?: EventColor
  },
  userId: string,
  isNew: boolean = false
): Partial<CalendarEventDB> {
  const dbEvent: Partial<CalendarEventDB> = {
    user_id: userId,
    title: event.title,
    description: event.description || null,
    start_date: event.start.toISOString(),
    end_date: event.end.toISOString(),
    all_day: event.allDay || false,
    location: event.location || null,
    etiquette: event.color || 'sky',
  }

  // Only include id for updates, not for new events (let DB generate UUID)
  if (!isNew && event.id) {
    dbEvent.id = event.id
  }

  return dbEvent
}

// Fetch all events for a user within a date range
export async function getUserEvents(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<CalendarEventDB[]> {
  let query = supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true })

  if (startDate) {
    query = query.gte('start_date', startDate.toISOString())
  }
  if (endDate) {
    query = query.lte('start_date', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching calendar events:', error)
    throw error
  }

  return data || []
}

// Create a new event
export async function createEvent(
  event: {
    title: string
    description?: string
    start: Date
    end: Date
    allDay?: boolean
    location?: string
    color?: EventColor
  },
  userId: string
): Promise<CalendarEventDB> {
  // Don't pass id for new events - let database generate UUID
  const dbEvent = fromCalendarEventToDB(event, userId, true)

  const { data, error } = await supabase
    .from('calendar_events')
    .insert(dbEvent)
    .select()
    .single()

  if (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }

  return data
}

// Update an existing event
export async function updateEvent(
  eventId: string,
  event: {
    title?: string
    description?: string
    start?: Date
    end?: Date
    allDay?: boolean
    location?: string
    color?: EventColor
  },
  userId: string
): Promise<CalendarEventDB> {
  const updateData: Partial<CalendarEventDB> = {
    user_id: userId,
  }

  if (event.title !== undefined) updateData.title = event.title
  if (event.description !== undefined)
    updateData.description = event.description || null
  if (event.start !== undefined)
    updateData.start_date = event.start.toISOString()
  if (event.end !== undefined) updateData.end_date = event.end.toISOString()
  if (event.allDay !== undefined) updateData.all_day = event.allDay
  if (event.location !== undefined)
    updateData.location = event.location || null
  if (event.color !== undefined) updateData.etiquette = event.color

  const { data, error } = await supabase
    .from('calendar_events')
    .update(updateData)
    .eq('id', eventId)
    .eq('user_id', userId) // Ensure user can only update their own events
    .select()
    .single()

  if (error) {
    console.error('Error updating calendar event:', error)
    throw error
  }

  return data
}

// Delete an event
export async function deleteEvent(
  eventId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', userId) // Ensure user can only delete their own events

  if (error) {
    console.error('Error deleting calendar event:', error)
    throw error
  }
}

// Get a single event by ID
export async function getEventById(
  eventId: string,
  userId: string
): Promise<CalendarEventDB | null> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error('Error fetching calendar event:', error)
    throw error
  }

  return data
}
