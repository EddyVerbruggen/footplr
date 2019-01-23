const MONTHNAMES = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export function getAgeYears(birthdate: Date): number {
  return Math.ceil((new Date().getTime() - new Date(birthdate).getTime()) / 3.15576e+10);
}

export function getAgeMonths(birthdate: Date): number {
  const dayCompensation = new Date().getDate() > birthdate.getDate() ? 0 : 1;
  const monthsElapsedThisYear = new Date().getMonth();
  let result;
  if (monthsElapsedThisYear > birthdate.getMonth()) {
    result = monthsElapsedThisYear - birthdate.getMonth() - dayCompensation;
  } else {
    result = monthsElapsedThisYear + (13 - birthdate.getMonth()) - dayCompensation;
  }
  return result === 12 ? 0 : result;
}

export function formatDate(date: Date): string {
  if (!date || (typeof date === "string")) {
    return "";
  }
  // return `${date.getDate()} ${MONTHNAMES[date.getMonth()]} '${("" + date.getFullYear()).substring(2)}`;
  return `${date.getDate()} ${MONTHNAMES[date.getMonth()]} ${date.getFullYear()}`;
}