import { ModuleItem } from "@/types/module.type";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}

export function formatDate1(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function formatDate2(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

export function formatTime(dateString: string): string {
  const date = new Date();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  const formattedTime = `${padZero(hour)}:${padZero(minute)}:${padZero(
    second
  )}`;
  return formattedTime;
}

export function dateDiff(date1: string, date2: string) {
  const fromDate = new Date(date1);
  const toDate = new Date(date2);
  const diff = Math.abs(toDate.getTime() - fromDate.getTime());
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffMonths =
    toDate.getMonth() +
    1 -
    (fromDate.getMonth() + 1) +
    12 * (toDate.getFullYear() - fromDate.getFullYear());

  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();
  let diffYears = toYear - fromYear;

  // Adjust for fractional year
  if (
    toDate < fromDate ||
    (toDate.getMonth() === fromDate.getMonth() &&
      toDate.getDate() < fromDate.getDate())
  ) {
    diffYears--;
  }

  let result =
    diffSeconds > 1
      ? diffSeconds + " seconds ago"
      : diffSeconds + " second ago";

  if (diffYears > 0) {
    result = diffYears > 1 ? diffYears + " years ago" : diffYears + " year ago";
    result = formatDate(date2);
  } else if (diffMonths > 0) {
    result =
      diffMonths > 1 ? diffMonths + " months ago" : diffMonths + " month ago";
    result = formatDate(date2);
  } else if (diffDays > 0) {
    result = diffDays > 1 ? diffDays + " days ago" : diffDays + " day ago";
    if (diffDays > 7) {
      result = formatDate(date2);
    }
  } else if (diffHours > 0) {
    result = diffHours > 1 ? diffHours + " hours ago" : diffHours + " hour ago";
  } else if (diffMinutes > 0) {
    result =
      diffMinutes > 1
        ? diffMinutes + " minutes ago"
        : diffMinutes + " minute ago";
  }

  return result;
}

function padZero(num: number) {
  return num.toString().padStart(2, "0");
}

export function getLastUpdatedTimeString(updatedAt: string, serverTime: string): string {
  if (updatedAt == null) {
    return "";
  }

  const updatedDate: Date = new Date(updatedAt);
  const serverDate: Date = new Date(serverTime);

  // Get the start of the day for both dates
  const startOfUpdatedDate: Date = new Date(updatedDate);
  startOfUpdatedDate.setHours(0, 0, 0, 0); // Set to midnight

  const startOfServerDate: Date = new Date(serverDate);
  startOfServerDate.setHours(0, 0, 0, 0); // Set to midnight

  const timeDiff: number = serverDate.getTime() - updatedDate.getTime(); // Difference in milliseconds

  const oneDay: number = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const oneYear: number = 365 * oneDay; // Milliseconds in a year

  // Check if the updated date is yesterday
  const isYesterday = startOfServerDate.getTime() === startOfUpdatedDate.getTime() - oneDay;
  const hours: number = updatedDate.getHours();
  const minutes: number = updatedDate.getMinutes();
  const ampm: string = hours >= 12 ? 'PM' : 'AM';

  if (isYesterday) {
    // const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    // const formattedTime: string = updatedDate.toLocaleString("en-US", options);
    // return `Yesterday ${formattedTime}`;
    const hours: number = updatedDate.getHours();
    const minutes: number = updatedDate.getMinutes();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
    const formattedTime: string = `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    return `Yesterday ${formattedTime}`;
  }

  // Check if the difference is less than a year
  if (timeDiff < oneYear) {
    const formattedTime: string = `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return updatedDate.toLocaleDateString("en-US", options) + ", " + formattedTime;
  }

  // For dates older than a year
  const optionsWithYear: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return updatedDate.toLocaleDateString("en-US", optionsWithYear);
}

export function sortModulesByDateAndType(modules: ModuleItem[], updatedAt: string): ModuleItem[] {
  const ventureUpdatedDate = new Date(updatedAt);
  const itemOrder: { [key: string]: number } = {
    Problem: 1,
    Character: 2,
    Solution: 3,
    Setting: 4,
  };
  return modules.sort((a, b) => {
    // Get the lastUpdated date or use the static date
    const dateA = a.lastUpdated ? new Date(a.lastUpdated) : ventureUpdatedDate;
    const dateB = b.lastUpdated ? new Date(b.lastUpdated) : ventureUpdatedDate;

    // Compare by lastUpdated date first
    const dateComparison = dateB.getTime() - dateA.getTime(); // Sort by recent first

    if (dateComparison !== 0) {
      return dateComparison; // If dates are different, return the date comparison
    }

    // If dates are the same, sort by module.item order
    return (itemOrder[a.module.item] || 0) - (itemOrder[b.module.item] || 0);
  });
}

  // Converts an ISO date string to local date format (e.g., "YYYY-MM-DD HH:mm")
  export const toLocalDateString = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

export  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));