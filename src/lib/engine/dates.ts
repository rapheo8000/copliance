import {
  lastDayOfMonth,
  addMonths,
  isWeekend,
  addDays,
  getYear,
  isBefore,
} from "date-fns";

// French public holidays for a given year
export function getFrenchHolidays(year: number): Date[] {
  // Easter calculation (Meeus algorithm)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easter = new Date(year, month, day);
  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMonday = addDays(easter, 50);

  return [
    new Date(year, 0, 1), // Jour de l'an
    easter,
    easterMonday,
    new Date(year, 4, 1), // Fete du travail
    new Date(year, 4, 8), // Victoire 1945
    ascension,
    whitMonday,
    new Date(year, 6, 14), // Fete nationale
    new Date(year, 7, 15), // Assomption
    new Date(year, 10, 1), // Toussaint
    new Date(year, 10, 11), // Armistice
    new Date(year, 11, 25), // Noel
  ];
}

function isFrenchHoliday(date: Date): boolean {
  const holidays = getFrenchHolidays(getYear(date));
  return holidays.some(
    (h) =>
      h.getFullYear() === date.getFullYear() &&
      h.getMonth() === date.getMonth() &&
      h.getDate() === date.getDate()
  );
}

// Get the next business day (skipping weekends and French holidays)
export function getNextBusinessDay(date: Date): Date {
  let current = date;
  while (isWeekend(current) || isFrenchHoliday(current)) {
    current = addDays(current, 1);
  }
  return current;
}

// Get the previous business day (for deadlines that fall on weekends)
export function getPreviousBusinessDay(date: Date): Date {
  let current = date;
  while (isWeekend(current) || isFrenchHoliday(current)) {
    current = addDays(current, -1);
  }
  return current;
}

// Urssaf quarterly declaration dates
// Q1 (Jan-Mar): April 30
// Q2 (Apr-Jun): July 31
// Q3 (Jul-Sep): October 31
// Q4 (Oct-Dec): January 31 (next year)
export function getUrssafQuarterlyDates(year: number): Date[] {
  return [
    new Date(year, 3, 30), // April 30
    new Date(year, 6, 31), // July 31
    new Date(year, 9, 31), // October 31
    new Date(year + 1, 0, 31), // January 31 next year
  ];
}

// Urssaf monthly declaration dates
// Due the last day of M+1 (e.g., January revenue declared by Feb 28)
export function getUrssafMonthlyDates(year: number): Date[] {
  const dates: Date[] = [];
  for (let month = 0; month < 12; month++) {
    // Due date is last day of the following month
    const dueDate = lastDayOfMonth(new Date(year, month + 1, 1));
    dates.push(dueDate);
  }
  return dates;
}

// CFE due date: December 15 each year
export function getCfeDueDate(year: number): Date {
  return new Date(year, 11, 15);
}

// Income tax declaration: typically mid-May to early June
export function getIncomeTaxDueDate(year: number): Date {
  // Conservative default: May 22 (zone 1)
  return new Date(year, 4, 22);
}

// Check if this is the first calendar year after creation
export function isFirstCalendarYear(creationDate: Date, referenceDate: Date): boolean {
  return getYear(creationDate) === getYear(referenceDate);
}

// Get all upcoming dates within the next N months from reference date
export function getUpcomingDates(
  dates: Date[],
  referenceDate: Date,
  monthsAhead: number = 12
): Date[] {
  const endDate = addMonths(referenceDate, monthsAhead);
  return dates.filter(
    (d) => !isBefore(d, referenceDate) && isBefore(d, endDate)
  );
}
