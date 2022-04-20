export function parseTime(bestTime){
  try {
    return `${bestTime.datetimeStr.split("T")[1].split("-")[0].split(':')[0]}:00`;
  } catch {}
}