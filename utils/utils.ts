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
  const timeDiff: number = serverDate.getTime() - updatedDate.getTime(); // Difference in milliseconds

  const oneDay: number = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const oneYear: number = 365 * oneDay; // Milliseconds in a year

  // Check if the difference is less than a day
  if (timeDiff < oneDay) {
      const hours: number = updatedDate.getHours();
      const minutes: number = updatedDate.getMinutes();
      const ampm: string = hours >= 12 ? 'PM' : 'AM';
      const formattedTime: string = `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${ampm}`;
      return `Yesterday ${formattedTime}`;
  }

  // Check if the difference is less than a year
  if (timeDiff < oneYear) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      return updatedDate.toLocaleDateString('en-US', options);
  }

  // For dates older than a year
  const optionsWithYear: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return updatedDate.toLocaleDateString('en-US', optionsWithYear);
}