// Business hours calculator that excludes weekends and holidays

export const US_HOLIDAYS_2025 = [
  new Date("2025-01-01"), // New Year's Day
  new Date("2025-01-20"), // MLK Day
  new Date("2025-02-17"), // Presidents Day
  new Date("2025-05-26"), // Memorial Day
  new Date("2025-07-04"), // Independence Day
  new Date("2025-09-01"), // Labor Day
  new Date("2025-10-13"), // Columbus Day
  new Date("2025-11-11"), // Veterans Day
  new Date("2025-11-27"), // Thanksgiving
  new Date("2025-12-25"), // Christmas
];

const BUSINESS_HOURS_START = 8; // 8am
const BUSINESS_HOURS_END = 17; // 5pm
const BUSINESS_HOURS_PER_DAY = BUSINESS_HOURS_END - BUSINESS_HOURS_START;

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const isHoliday = (date: Date): boolean => {
  const dateStr = date.toISOString().split("T")[0];
  return US_HOLIDAYS_2025.some(
    (holiday) => holiday.toISOString().split("T")[0] === dateStr
  );
};

export const isBusinessDay = (date: Date): boolean => {
  return !isWeekend(date) && !isHoliday(date);
};

/**
 * Calculate business hours between two dates
 * Only counts 8am-5pm, Monday-Friday, excluding holidays
 */
export const calculateBusinessHours = (
  startDate: string | Date,
  endDate: string | Date
): number | null => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end <= start) return 0;

  let totalHours = 0;
  const current = new Date(start);

  // Move to start of business hours if before
  if (current.getHours() < BUSINESS_HOURS_START) {
    current.setHours(BUSINESS_HOURS_START, 0, 0, 0);
  }

  while (current < end) {
    if (isBusinessDay(current)) {
      const dayStart = new Date(current);
      dayStart.setHours(BUSINESS_HOURS_START, 0, 0, 0);

      const dayEnd = new Date(current);
      dayEnd.setHours(BUSINESS_HOURS_END, 0, 0, 0);

      // Calculate hours for this day
      const effectiveStart = current < dayStart ? dayStart : current;
      const effectiveEnd = end < dayEnd ? end : dayEnd;

      if (effectiveStart < effectiveEnd) {
        const hoursThisDay =
          (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60);
        totalHours += hoursThisDay;
      }
    }

    // Move to next day
    current.setDate(current.getDate() + 1);
    current.setHours(BUSINESS_HOURS_START, 0, 0, 0);
  }

  return totalHours >= 0 ? totalHours : null;
};
