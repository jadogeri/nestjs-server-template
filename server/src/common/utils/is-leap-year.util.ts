/**
 * Returns true if the given year (or current year) is a leap year.
 */
export function isLeapYear(year: number = new Date().getFullYear()): boolean {
  // A leap year is divisible by 4, 
  // but not by 100, 
  // unless it is also divisible by 400.
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
