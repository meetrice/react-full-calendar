"use client"

import React, { useMemo } from "react"
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
} from "date-fns"
import type { CalendarEvent } from "./types"
import { getEventsForDay } from "./utils"

interface YearViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventSelect: (event: CalendarEvent) => void
}

export function YearView({ currentDate, events, onEventSelect }: YearViewProps) {
  const year = currentDate.getFullYear()

  // Get all months for the current year
  const months = useMemo(() => {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
    return eachMonthOfInterval({ start: yearStart, end: yearEnd })
  }, [year])

  // Get weekdays for header
  const weekdays = useMemo(() => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  }, [])

  // Generate calendar grid for a month
  const generateMonthGrid = (monthDate: Date) => {
    const firstDay = startOfMonth(monthDate)
    const lastDay = endOfMonth(monthDate)
    const daysInMonth = getDaysInMonth(monthDate)
    const startDayOfWeek = firstDay.getDay()

    const days: Array<Date | null> = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, monthDate.getMonth(), i))
    }

    return days
  }

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelect(event)
  }

  // Check if a month has any events
  const monthHasEvents = (monthDate: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.start)
      return eventDate.getFullYear() === year && eventDate.getMonth() === monthDate.getMonth()
    })
  }

  return (
    <div data-slot="year-view" className="p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month, monthIndex) => {
          const monthGrid = generateMonthGrid(month)
          const hasEvents = monthHasEvents(month)

          return (
            <div
              key={monthIndex}
              className="border-border/70 rounded-lg border bg-card"
            >
              {/* Month header */}
              <div className="border-border/70 border-b px-3 py-2">
                <h3 className="text-sm font-semibold">
                  {format(month, "MMMM")}
                </h3>
              </div>

              {/* Calendar grid */}
              <div className="p-2">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-0.5">
                  {weekdays.map((day) => (
                    <div
                      key={day}
                      className="text-muted-foreground/70 py-1 text-center text-[10px]"
                    >
                      {day.charAt(0)}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {monthGrid.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={`empty-${dayIndex}`} className="aspect-square" />
                    }

                    const dayEvents = getEventsForDay(events, day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const dayIsToday = isToday(day)

                    return (
                      <div
                        key={dayIndex}
                        className="group relative aspect-square"
                      >
                        <div
                          className={`
                            flex h-full w-full items-center justify-center rounded text-xs
                            ${dayIsToday
                              ? "bg-primary text-primary-foreground font-semibold"
                              : hasEvents && dayEvents.length > 0
                                ? "bg-muted/50 hover:bg-muted cursor-pointer"
                                : isCurrentMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground/50"
                            }
                          `}
                        >
                          {format(day, "d")}
                        </div>

                        {/* Event indicator dots */}
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className="h-1 w-1 rounded-full bg-current opacity-60"
                                style={{
                                  color: `hsl(var(--${event.color || "sky"}))`,
                                }}
                                title={event.title}
                              />
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
