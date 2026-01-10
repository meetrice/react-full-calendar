import { useEffect, useState } from "react"
import { addDays, setHours, setMinutes, subDays } from "date-fns"
import { DefaultLayout } from './layout';
import { EventCalendar } from "@/components/ui/calendar/event-calendar"
import { type CalendarEvent } from "@/components/ui/calendar/types"
import { useCalendarEvents } from "@/hooks/use-calendar-events"
import { useAuth } from "@/auth/context/auth-context"

// Sample events data with hardcoded times (fallback when no Supabase or no events)
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Annual Planning",
    description: "Strategic planning for next year",
    start: subDays(new Date(), 24),
    end: subDays(new Date(), 23),
    allDay: true,
    color: "sky",
    location: "Main Conference Hall",
  },
  {
    id: "2",
    title: "Project Deadline",
    description: "Submit final deliverables",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
    color: "amber",
    location: "Office",
  },
  {
    id: "3",
    title: "Quarterly Budget Review",
    description: "Strategic planning for next year",
    start: subDays(new Date(), 13),
    end: subDays(new Date(), 13),
    allDay: true,
    color: "orange",
    location: "Main Conference Hall",
  },
  {
    id: "4",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(new Date(), 10), 0),
    end: setMinutes(setHours(new Date(), 11), 0),
    color: "sky",
    location: "Conference Room A",
  },
  {
    id: "5",
    title: "Lunch with Client",
    description: "Discuss new project requirements",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15),
    color: "emerald",
    location: "Downtown Cafe",
  },
  {
    id: "6",
    title: "Product Launch",
    description: "New product release",
    start: addDays(new Date(), 3),
    end: addDays(new Date(), 6),
    allDay: true,
    color: "violet",
  },
  {
    id: "7",
    title: "Sales Conference",
    description: "Discuss about new clients",
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30),
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 45),
    color: "rose",
    location: "Downtown Cafe",
  },
  {
    id: "8",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0),
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30),
    color: "orange",
    location: "Conference Room A",
  },
  {
    id: "9",
    title: "Review contracts",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0),
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30),
    color: "sky",
    location: "Conference Room A",
  },
  {
    id: "10",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45),
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0),
    color: "amber",
    location: "Conference Room A",
  },
  {
    id: "11",
    title: "Marketing Strategy Session",
    description: "Quarterly marketing planning",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0),
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30),
    color: "emerald",
    location: "Marketing Department",
  },
  {
    id: "12",
    title: "Annual Shareholders Meeting",
    description: "Presentation of yearly results",
    start: addDays(new Date(), 17),
    end: addDays(new Date(), 17),
    allDay: true,
    color: "sky",
    location: "Grand Conference Center",
  },
  {
    id: "13",
    title: "Product Development Workshop",
    description: "Brainstorming for new features",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0),
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0),
    color: "rose",
    location: "Innovation Lab",
  },
]

// Inner component that renders the calendar
function CalendarPageContent({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: {
  events: CalendarEvent[]
  onEventAdd: (event: CalendarEvent) => Promise<void>
  onEventUpdate: (event: CalendarEvent) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
}) {
  return (
    <EventCalendar
      className="h-full"
      events={events}
      onEventAdd={onEventAdd}
      onEventUpdate={onEventUpdate}
      onEventDelete={onEventDelete}
    />
  )
}

// Layout wrapper with calendar events management
function CalendarLayoutWrapper() {
  const { user } = useAuth()
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>([])
  const [useSupabase, setUseSupabase] = useState(false)

  const {
    events: supabaseEvents,
    error,
    handleEventAdd,
    handleEventUpdate,
    handleEventDelete,
  } = useCalendarEvents()

  useEffect(() => {
    const hasValidSupabaseConfig =
      import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

    if (user?.id && hasValidSupabaseConfig && !error) {
      setUseSupabase(true)
    } else {
      setUseSupabase(false)
      setLocalEvents(sampleEvents)
    }
  }, [user?.id, error])

  const events = useSupabase ? supabaseEvents : localEvents

  const handleEventAddWrapper = async (event: CalendarEvent) => {
    if (useSupabase) {
      await handleEventAdd(event)
    } else {
      setLocalEvents([...localEvents, event])
    }
  }

  const handleEventUpdateWrapper = async (updatedEvent: CalendarEvent) => {
    if (useSupabase) {
      await handleEventUpdate(updatedEvent)
    } else {
      setLocalEvents(
        localEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      )
    }
  }

  const handleEventDeleteWrapper = async (eventId: string) => {
    if (useSupabase) {
      await handleEventDelete(eventId)
    } else {
      setLocalEvents(localEvents.filter((event) => event.id !== eventId))
    }
  }

  return (
    <DefaultLayout
      events={events}
      calendarContent={
        <CalendarPageContent
          events={events}
          onEventAdd={handleEventAddWrapper}
          onEventUpdate={handleEventUpdateWrapper}
          onEventDelete={handleEventDeleteWrapper}
        />
      }
    />
  )
}

export default function CalendarModule() {
  return <CalendarLayoutWrapper />
}
