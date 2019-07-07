export function genRandomString(): string {
  return Math.random()
    .toString(36)
    .substring(7)
}

export function cloneDeep(object: any): any {
  return JSON.parse(JSON.stringify(object))
}

export function formatDate(date: string) {
  if (!date) return ''

  const newDate = new Date(Date.parse(date))
  const year = newDate.getFullYear(),
    month = newDate.getMonth() + 1, // months are zero indexed
    monthFormatted = month < 10 ? '0' + month : month,
    day = newDate.getDate(),
    hour = newDate.getHours(),
    hourFormatted = hour < 10 ? '0' + hour : hour,
    minute = newDate.getMinutes(),
    // hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
    minuteFormatted = minute < 10 ? '0' + minute : minute
  // morning = hour < 12 ? ' AM' : ' PM'

  return day + '/' + monthFormatted + '/' + year + ' ' + hourFormatted + ':' + minuteFormatted
}

export function truncate(text: string, length: number, clamp?: string) {
  return text.slice(0, length) + (length < text.length ? clamp || '...' : '')
}
