import { memo } from "react"

import {
  type CalendarEvent,
  dateInViewerZone,
  formatMonth,
  formatShortDate,
  formatTime,
  isSameDay,
  UntitledEventText,
  useDisplaySettings,
  useEventProps,
} from "@rencomputer/rencal-sdk"

export const BoardCard = memo(function BoardCard({
  event,
  showDate,
}: {
  event: CalendarEvent
  showDate?: boolean
}) {
  const { timeFormat } = useDisplaySettings()
  const eventProps = useEventProps(event)

  const formatRangeDate = (date: CalendarEvent["start"]): string => {
    const plainDate = dateInViewerZone(date)
    return `${formatMonth(plainDate, "short")} ${plainDate.day},`
  }

  return (
    <div
      {...eventProps}
      data-view="board"
      className="cursor-default py-1.5 border-b border-border last:border-b-0 outline-none"
    >
      <div className="flex gap-3 pl-3 pr-2">
        {/* Left accent bar — no rounding, matches event blocks in other views */}
        <div data-slot="calendar-event-color-marker" className="w-[3px] shrink-0 self-stretch" />
        <div className="min-w-0">
          {showDate && (
            <div
              data-slot="calendar-event-time"
              data-typography="numerical"
              className="text-xs text-muted-foreground h-4"
            >
              {formatShortDate(event.start)}
            </div>
          )}

          <div data-slot="calendar-event-title" className="text-sm font-medium truncate">
            {event.summary || <UntitledEventText />}
          </div>

          {event.start.kind !== "date" && (
            <div
              data-slot="calendar-event-time"
              data-typography="numerical"
              className="text-muted-foreground text-xs h-4"
            >
              {isSameDay(event.start, event.end)
                ? `${formatTime(event.start, timeFormat)} - ${formatTime(event.end, timeFormat)}`
                : `${formatRangeDate(event.start)} ${formatTime(event.start, timeFormat)} - ${formatRangeDate(event.end)} ${formatTime(event.end, timeFormat)}`}
            </div>
          )}

          {event.start.kind === "date" && (
            <div data-slot="calendar-event-time" className="text-xs text-muted-foreground h-4">
              All day
            </div>
          )}

          {event.location && (
            <div className="text-xs text-muted-foreground truncate">{event.location}</div>
          )}
        </div>
      </div>
    </div>
  )
})
