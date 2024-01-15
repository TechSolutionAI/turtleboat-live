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
