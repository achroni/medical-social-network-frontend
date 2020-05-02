export function getTimeAgo(timestamp) {
  const now = new Date();
  const dateStamp = new Date(timestamp);
  const timeago = now.getTime() - dateStamp.getTime();
  const sec = timeago / 1000;
  const min = sec / 60;
  const hours = min / 60;
  const days = hours / 24;
  let retValue = "";
  if (Math.floor(days) !== 0) {
    retValue = `${Math.floor(days)} ${
      Math.floor(days) > 1 ? "days ago" : "day ago"
    }`;
  } else if (Math.floor(hours) !== 0) {
    const time = Math.floor(hours) - 24 * Math.floor(days);
    retValue = `${time} ${time > 1 ? "hours ago" : "hour ago"}`;
  } else if (Math.floor(min) !== 0)
    retValue = `${Math.floor(min) - Math.floor(hours) * 60} min ago`;
  else if (Math.floor(sec) !== 0)
    retValue = `${Math.floor(sec) - Math.floor(min) * 60} sec ago`;
  else retValue = "Just now";
  return retValue;
}
