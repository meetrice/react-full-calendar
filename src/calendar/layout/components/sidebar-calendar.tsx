"use client"

import * as React from "react"
import { format, startOfDay, endOfDay } from "date-fns"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useCalendarData } from "@/calendar/context/calendar-data-context"
import type { EventColor } from "@/components/ui/calendar/types"

// Map event colors to CSS classes
const colorClasses: Record<EventColor, string> = {
  sky: "after:bg-sky-400",
  amber: "after:bg-amber-400",
  violet: "after:bg-violet-400",
  rose: "after:bg-rose-400",
  emerald: "after:bg-emerald-400",
  orange: "after:bg-orange-400",
}

export default function SidebarCalendar() {
  const { selectedDate, events, setSelectedDate, openEventDialog, openNewEventDialog } = useCalendarData()

  // Filter events for the selected date
  const dayEvents = React.useMemo(() => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const selectedDayStart = startOfDay(selectedDate)
      const selectedDayEnd = endOfDay(selectedDate)

      // Check if event overlaps with the selected date
      return (
        (eventStart >= selectedDayStart && eventStart <= selectedDayEnd) ||
        (eventEnd >= selectedDayStart && eventEnd <= selectedDayEnd) ||
        (eventStart <= selectedDayStart && eventEnd >= selectedDayEnd)
      )
    })
  }, [events, selectedDate])

  // Sort events by start time
  const sortedEvents = React.useMemo(() => {
    return [...dayEvents].sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime()
    })
  }, [dayEvents])

  const handleEventClick = (event: typeof sortedEvents[0]) => {
    openEventDialog(event)
  }

  const handleAddEvent = () => {
    // Start the new event at the beginning of the selected date (9 AM)
    const startTime = new Date(selectedDate)
    startTime.setHours(9, 0, 0, 0)
    openNewEventDialog(startTime)
  }

  return (
    <div className="w-full space-y-6 pt-6 lg:py-2 pb-6">
      <div className="px-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="w-full bg-transparent text-white p-0"
          required
        />
      </div>
      <div className="flex flex-col items-start gap-3 px-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-white text-sm font-medium">
            {selectedDate?.toLocaleDateString("zh-CN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Add Event"
            onClick={handleAddEvent}
          >
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
        {sortedEvents.length === 0 ? (
          <div className="text-muted-foreground text-sm py-4 text-center w-full">
            暂无事件
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "text-white bg-muted relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-white/10 transition-colors",
                  colorClasses[event.color as EventColor] || "after:bg-sky-400"
                )}
                onClick={() => handleEventClick(event)}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-muted-foreground text-xs">
                  {event.allDay ? (
                    "全天"
                  ) : (
                    <>
                      {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                    </>
                  )}
                </div>
                {event.location && (
                  <div className="text-muted-foreground text-xs truncate">
                    {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
