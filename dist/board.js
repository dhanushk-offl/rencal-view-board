import { jsx, jsxs } from "react/jsx-runtime";
import { Temporal } from "@js-temporal/polyfill";
import { memo, useMemo } from "react";
import { useDisplaySettings, useEventAppearance, useEventSelection, formatShortDate, UntitledEventText, isSameDay, formatTime, dateInViewerZone, formatMonth, cn, useToday, startOfWeek, useEventsInRange } from "@rencal/plugin-api";
const BoardCard = memo(function BoardCard2({
  event,
  showDate
}) {
  const { timeFormat } = useDisplaySettings();
  const { style, rsvp } = useEventAppearance(event);
  const selection = useEventSelection();
  const highlighted = selection.isSelected(event);
  const formatRangeDate = (date) => {
    const plainDate = dateInViewerZone(date);
    return `${formatMonth(plainDate, "short")} ${plainDate.day},`;
  };
  const handleClick = (e) => {
    e.stopPropagation();
    selection.toggle(event, e.currentTarget);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "calendar-event",
      "data-view": "board",
      "data-kind": event.start.kind === "date" ? "all-day" : "timed",
      "data-selected": highlighted || void 0,
      "data-rsvp": rsvp ?? void 0,
      className: "cursor-default py-1.5 border-b border-border last:border-b-0 outline-none",
      "data-event-clickable": true,
      style,
      onClick: handleClick,
      children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pl-3 pr-2", children: [
        /* @__PURE__ */ jsx("div", { "data-slot": "calendar-event-color-marker", className: "w-[3px] shrink-0 self-stretch" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          showDate && /* @__PURE__ */ jsx(
            "div",
            {
              "data-slot": "calendar-event-time",
              "data-typography": "numerical",
              className: "text-xs text-muted-foreground h-4",
              children: formatShortDate(event.start)
            }
          ),
          /* @__PURE__ */ jsx("div", { "data-slot": "calendar-event-title", className: "text-sm font-medium truncate", children: event.summary || /* @__PURE__ */ jsx(UntitledEventText, {}) }),
          event.start.kind !== "date" && /* @__PURE__ */ jsx(
            "div",
            {
              "data-slot": "calendar-event-time",
              "data-typography": "numerical",
              className: "text-muted-foreground text-xs h-4",
              children: isSameDay(event.start, event.end) ? `${formatTime(event.start, timeFormat)} - ${formatTime(event.end, timeFormat)}` : `${formatRangeDate(event.start)} ${formatTime(event.start, timeFormat)} - ${formatRangeDate(event.end)} ${formatTime(event.end, timeFormat)}`
            }
          ),
          event.start.kind === "date" && /* @__PURE__ */ jsx("div", { "data-slot": "calendar-event-time", className: "text-xs text-muted-foreground h-4", children: "All day" }),
          event.location && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: event.location })
        ] })
      ] })
    }
  );
});
function BoardColumn({
  title,
  events,
  showDate,
  isToday,
  isLast,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "board-column",
      className: cn(
        "flex flex-col flex-1 min-w-0 border-r border-border overflow-hidden",
        isLast && "border-r-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-slot": "board-column-header",
            "data-today": isToday || void 0,
            className: cn(
              "flex items-center justify-between px-3 py-2 border-b border-border shrink-0",
              isToday && "bg-accent text-accent-foreground"
            ),
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "data-typography": "numerical",
                  className: "text-2xs text-muted-foreground font-medium uppercase tracking-wide",
                  children: title
                }
              ),
              /* @__PURE__ */ jsx("span", { "data-typography": "numerical", className: "text-2xs text-muted-foreground tabular-nums", children: events.length > 0 ? events.length : "" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col overflow-y-auto grow", children: [
          events.map((event) => /* @__PURE__ */ jsx(BoardCard, { event, showDate }, event.key)),
          events.length === 0 && /* @__PURE__ */ jsx(
            "div",
            {
              "data-typography": "numerical",
              className: "text-xs text-muted-foreground text-center py-8",
              children: "—"
            }
          )
        ] })
      ]
    }
  );
}
function BoardView() {
  const { firstDayOfWeek } = useDisplaySettings();
  const today = useToday();
  const { yesterday, endOfWeek } = useMemo(
    () => ({
      yesterday: today.subtract({ days: 1 }),
      endOfWeek: startOfWeek(today, firstDayOfWeek).add({ days: 6 })
    }),
    [today, firstDayOfWeek]
  );
  const calendarEvents = useEventsInRange(yesterday, endOfWeek.add({ days: 1 }));
  const columns = useMemo(() => {
    const tomorrow = today.add({ days: 1 });
    function getBucketId(pd) {
      if (pd.equals(yesterday)) return "yesterday";
      if (pd.equals(today)) return "today";
      if (pd.equals(tomorrow)) return "tomorrow";
      if (Temporal.PlainDate.compare(pd, tomorrow) > 0 && Temporal.PlainDate.compare(pd, endOfWeek) <= 0)
        return "this-week";
      return "past";
    }
    const bucketDefs = {
      yesterday: { title: "Yesterday", showDate: false, isToday: false },
      today: { title: "Today", showDate: false, isToday: true },
      tomorrow: { title: "Tomorrow", showDate: false, isToday: false },
      "this-week": { title: "This Week", showDate: true, isToday: false }
    };
    const buckets = /* @__PURE__ */ new Map();
    for (const event of calendarEvents) {
      const pd = dateInViewerZone(event.start);
      const bucketId = getBucketId(pd);
      if (bucketId === "past") continue;
      const group = buckets.get(bucketId);
      if (group) {
        group.push(event);
      } else {
        buckets.set(bucketId, [event]);
      }
    }
    const orderedIds = ["yesterday", "today", "tomorrow", "this-week"];
    return orderedIds.map((id) => {
      const def = bucketDefs[id];
      return {
        id,
        title: def.title,
        events: buckets.get(id) ?? [],
        showDate: def.showDate,
        isToday: def.isToday
      };
    });
  }, [calendarEvents, today, yesterday, endOfWeek]);
  return /* @__PURE__ */ jsx("div", { className: "flex h-full overflow-hidden", children: columns.map((col, i) => /* @__PURE__ */ jsx(
    BoardColumn,
    {
      title: col.title,
      events: col.events,
      showDate: col.showDate,
      isToday: col.isToday,
      isLast: i === columns.length - 1
    },
    col.id
  )) });
}
export {
  BoardView as default
};
