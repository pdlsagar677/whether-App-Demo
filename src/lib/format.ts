const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayFromDate(dateString: string): string {
  return DAYS[new Date(dateString).getDay()];
}

export function getShortDay(dateString: string, isToday = false): string {
  if (isToday) return "Today";
  return DAYS[new Date(dateString).getDay()].slice(0, 3);
}

export function convertTimeToAMPM(timeString: string): string {
  const date = new Date(timeString);
  let hours = date.getHours();
  const minutesNum = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours || 12;
  const minutes = minutesNum < 10 ? `0${minutesNum}` : `${minutesNum}`;
  return `${hours}:${minutes} ${ampm}`;
}

export function getHourLabel(timeString: string, isFirst = false): string {
  if (isFirst) return "Now";
  const date = new Date(timeString);
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours || 12;
  return `${hours} ${ampm}`;
}

export function getHourFromISO(timeString: string): number {
  return new Date(timeString).getHours();
}
