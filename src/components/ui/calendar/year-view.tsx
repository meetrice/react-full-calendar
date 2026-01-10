"use client"

import React, { useMemo } from "react"
import {
  addDays,
  eachMonthOfInterval,
  endOfMonth,
  format,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import type { CalendarEvent } from "./types"
import { DefaultStartHour } from "./constants"
import { getEventsForDay } from "./utils"
import { useT } from "@/i18n"

interface YearViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventSelect: (event: CalendarEvent) => void
  onEventCreate: (startTime: Date) => void
}

export function YearView({ currentDate, events, onEventSelect, onEventCreate }: YearViewProps) {
  const { lang } = useT()
  const dateFnLocale = lang === 'zh' ? zhCN : enUS
  const year = currentDate.getFullYear()

  // Get all months for the current year
  const months = useMemo(() => {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
    return eachMonthOfInterval({ start: yearStart, end: yearEnd })
  }, [year])

  // Get weekdays for header
  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date()), i)
      return format(date, "EEE", { locale: dateFnLocale })
    })
  }, [dateFnLocale])

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

  const handleDateClick = (day: Date, e: React.MouseEvent) => {
    // Don't create event if clicking on an event indicator dot
    if ((e.target as HTMLElement).closest('[data-event-indicator]')) {
      return
    }
    const startTime = new Date(day)
    startTime.setHours(DefaultStartHour, 0, 0)
    onEventCreate(startTime)
  }

  return (
    <div data-slot="year-view" className="p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month, monthIndex) => {
          const monthGrid = generateMonthGrid(month)

          return (
            <div
              key={monthIndex}
              className="border-border/70 rounded-lg border bg-card"
            >
              {/* Month header */}
              <div className="border-border/70 border-b px-3 py-2">
                <h3 className="text-sm font-semibold">
                  {format(month, "MMMM", { locale: dateFnLocale })}
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
                            flex h-full w-full cursor-pointer items-center justify-center rounded text-xs transition-colors
                            ${dayIsToday
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "hover:bg-muted/50"
                            }
                          `}
                          onClick={(e) => handleDateClick(day, e)}
                        >
                          {format(day, "d")}
                        </div>

                        {/* Event indicator dots */}
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5" data-event-indicator>
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className="h-1 w-1 rounded-full bg-current opacity-60"
                                style={{
                                  color: `hsl(var(--${event.color || "sky"}))`,
                                }}
                                title={event.title}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEventClick(event, e)
                                }}
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
