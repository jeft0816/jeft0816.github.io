export function timeAgo(timestamp: number | null | undefined, now: number = Date.now()): string {
  if (timestamp == null || Number.isNaN(timestamp))
    return 'önce'

  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))

  if (seconds < 60)
    return 'saniyeler önce'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes}dk önce`

  const hours = Math.floor(minutes / 60)
  if (hours < 24)
    return `${hours}sa önce`

  return `${Math.floor(hours / 24)}g önce`
}
