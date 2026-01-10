import { createContext, useContext, useState, ReactNode } from "react"
import type { CalendarEvent } from "@/components/ui/calendar/types"

export interface CalendarDataContextValue {
  selectedDate: Date
  events: CalendarEvent[]
  setSelectedDate: (date: Date) => void
}

const CalendarDataContext = createContext<CalendarDataContextValue | undefined>(undefined)

export function CalendarDataProvider({ children, events }: { children: ReactNode; events: CalendarEvent[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <CalendarDataContext.Provider value={{ selectedDate, events, setSelectedDate }}>
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
