
let currentTimeout
let backoffTime = 500
let backoffs = 0

const defaultConfigURL = 'https://steviep.xyz/momi-activation/config.json'
let configURL = defaultConfigURL

export async function pingConfig(onPing=()=>{}) {
  console.log('Config last retrieved:', new Date())
  try {
    const res = await fetch(configURL, {cache: 'no-store'})
    if (!res.ok) throw new Error(`config request failed: ${res.status}`)
    const config = await res.json()

    backoffTime = 500
    backoffs = 0
    if (config.configURL) configURL = config.configURL
    else configURL = defaultConfigURL

    const now = new Date()
    const day = config.days.find(d => d.dayNumber === now.getDay())
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const hasWindow = day && day.startVolumeHour != null && day.endVolumeHour != null
    let startMinutes, endMinutes
    if (hasWindow) {
      startMinutes = day.startVolumeHour * 60 + (day.startVolumeMinutes || 0)
      endMinutes = day.endVolumeHour * 60 + (day.endVolumeMinutes || 0)
    }

    const inWindow = hasWindow && nowMinutes >= startMinutes && nowMinutes < endMinutes
    const volume = (inWindow && day.volume != null ? day.volume : config.defaultVolume) ?? 1

    onPing(volume)

    // wake at the next window boundary (start or end) if it comes before pingInterval,
    // padded by 1s so the boundary has passed when we re-check
    let pingTimeout = Math.max(1000, config.pingInterval) || 1200000
    if (hasWindow) {
      const msIntoDay = nowMinutes * 60000 + now.getSeconds() * 1000
      for (const boundary of [startMinutes, endMinutes]) {
        const msUntil = boundary * 60000 - msIntoDay
        if (msUntil > 0) pingTimeout = Math.min(pingTimeout, msUntil + 1000)
      }
    }

    clearTimeout(currentTimeout)
    console.log('ping timeout:', pingTimeout)
    currentTimeout = setTimeout(() => pingConfig(onPing), pingTimeout)
  } catch (e) {
    console.error(e)
    clearTimeout(currentTimeout)

    if (backoffs >= 10) configURL = defaultConfigURL
    currentTimeout = setTimeout(() => pingConfig(onPing), backoffTime)
    backoffTime = Math.min(10 * 60 * 1000, Math.max(500, backoffTime * 5))
    backoffs += 1
  }
}
