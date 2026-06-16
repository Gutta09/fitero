import { getCalendarClient, isCalendarConfigured } from "../calendar/auth.js";
import { planQueries } from "../db/index.js";
import type { AddToCalendarInput } from "./schemas.js";

export async function addToCalendar(input: AddToCalendarInput) {
  if (!isCalendarConfigured()) {
    return {
      success: false,
      message:
        "Google Calendar is not connected. Follow the steps in SETUP_CALENDAR.md, then try again.",
      events_created: 0,
    };
  }

  const calendar = await getCalendarClient();
  const activePlan = planQueries.getActive.get();

  const results: { date: string; focus: string; eventId: string }[] = [];
  const errors: string[] = [];

  for (const workout of input.workouts) {
    const startDate = new Date(`${workout.date}T${workout.start_time}:00`);
    const endDate = new Date(startDate.getTime() + workout.duration_minutes * 60_000);

    let description = `Fitero workout — ${workout.focus}`;
    if (activePlan) {
      const schedule = JSON.parse(activePlan.schedule) as {
        day: string;
        focus: string;
        exercises: { name: string; sets: number; reps: string }[];
      }[];
      const dayPlan = schedule.find((d) => d.focus === workout.focus);
      if (dayPlan) {
        const lines = dayPlan.exercises.map(
          (e) => `• ${e.name}  ${e.sets}×${e.reps}`
        );
        description = `Fitero — ${workout.focus}\n\n${lines.join("\n")}`;
      }
    }

    try {
      const event = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: `Fitero: ${workout.focus}`,
          description,
          start: { dateTime: startDate.toISOString() },
          end: { dateTime: endDate.toISOString() },
          reminders: {
            useDefault: false,
            overrides: [{ method: "popup", minutes: 30 }],
          },
        },
      });

      results.push({
        date: workout.date,
        focus: workout.focus,
        eventId: event.data.id ?? "",
      });
    } catch (err) {
      errors.push(`${workout.date} (${workout.focus}): ${(err as Error).message}`);
    }
  }

  return {
    success: errors.length === 0,
    events_created: results.length,
    events: results,
    errors: errors.length > 0 ? errors : undefined,
    message:
      results.length > 0
        ? `Added ${results.length} workout${results.length > 1 ? "s" : ""} to your Google Calendar with 30-minute reminders.`
        : "No events were created.",
  };
}

