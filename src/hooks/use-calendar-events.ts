import { useEffect, useState } from "react"
import { useAuth } from "@/auth/context/auth-context"
import type { CalendarEvent } from "@/components/ui/calendar/types"
import {
  getUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fromDBToCalendarEvent,
} from "@/lib/calendar-events"

export function useCalendarEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch events when user changes
  useEffect(() => {
    if (!user?.id) {
      setEvents([])
      setLoading(false)
      return
    }

    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const dbEvents = await getUserEvents(user.id)
        setEvents(dbEvents.map(fromDBToCalendarEvent))
      } catch (err) {
        console.error("Failed to fetch calendar events:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch events"))
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user?.id])

  const handleEventAdd = async (event: CalendarEvent) => {
    if (!user?.id) {
      throw new Error("User not authenticated")
    }

    try {
      const newDBEvent = await createEvent(event, user.id)
      const newEvent = fromDBToCalendarEvent(newDBEvent)
      setEvents((prev) => [...prev, newEvent])
      return newEvent
    } catch (err) {
      console.error("Failed to create calendar event:", err)
      throw err
    }
  }

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    if (!user?.id || !updatedEvent.id) {
      throw new Error("User not authenticated or event missing ID")
    }

    try {
      const updatedDBEvent = await updateEvent(updatedEvent.id, updatedEvent, user.id)
      const newEvent = fromDBToCalendarEvent(updatedDBEvent)
      setEvents((prev) =>
        prev.map((event) => (event.id === updatedEvent.id ? newEvent : event))
      )
      return newEvent
    } catch (err) {
      console.error("Failed to update calendar event:", err)
      throw err
    }
  }

  const handleEventDelete = async (eventId: string) => {
    if (!user?.id) {
      throw new Error("User not authenticated")
    }

    try {
      await deleteEvent(eventId, user.id)
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
    } catch (err) {
      console.error("Failed to delete calendar event:", err)
      throw err
    }
  }

  return {
    events,
    loading,
    error,
    handleEventAdd,
    handleEventUpdate,
    handleEventDelete,
  }
}
