import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { addHours } from "date-fns"
import type { CalendarEvent } from "@/components/ui/calendar/types"

export interface CalendarDataContextValue {
  selectedDate: Date
  events: CalendarEvent[]
  setSelectedDate: (date: Date) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
  isEventDialogOpen: boolean
  setIsEventDialogOpen: (open: boolean) => void
  openEventDialog: (event: CalendarEvent) => void
  openNewEventDialog: (startTime?: Date) => void
}

const CalendarDataContext = createContext<CalendarDataContextValue | undefined>(undefined)

export function CalendarDataProvider({ children, events }: { children: ReactNode; events: CalendarEvent[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  const openEventDialog = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }, [])

  const openNewEventDialog = useCallback((startTime?: Date) => {
    const now = startTime ?? new Date()
    // Round to next hour if not specified
    if (!startTime) {
      now.setMinutes(0, 0, 0)
      now.setHours(now.getHours() + 1)
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: now,
      end: addHours(now, 1),
      allDay: false,
    }
    setSelectedEvent(newEvent)
    setIsEventDialogOpen(true)
  }, [])

  return (
    <CalendarDataContext.Provider
      value={{
        selectedDate,
        events,
        setSelectedDate,
        selectedEvent,
        setSelectedEvent,
        isEventDialogOpen,
        setIsEventDialogOpen,
        openEventDialog,
        openNewEventDialog,
      }}
    >
      {children}
    </CalendarDataContext.Provider>
  )
}

export function useCalendarData() {
  const context = useContext(CalendarDataContext)
  if (!context) {
    throw new Error("useCalendarData must be used within CalendarDataProvider")
  }
  return context
}
