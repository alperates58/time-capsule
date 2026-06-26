export function getYearPath(year: number | string): string {
  return `/${year}`;
}

export function isValidYear(year: number | string): boolean {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return !isNaN(y) && y >= -10000 && y <= new Date().getFullYear() + 10;
}

export function getPreviousYear(year: number): number {
  return year - 1;
}

export function getNextYear(year: number): number {
  return year + 1;
}
