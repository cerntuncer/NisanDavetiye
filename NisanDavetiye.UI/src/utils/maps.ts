export function extractCoordsFromEmbedUrl(embedUrl: string): { lat: number; lng: number } | null {
  const latMatch = embedUrl.match(/!3d(-?\d+\.?\d*)/)
  const lngMatch = embedUrl.match(/!2d(-?\d+\.?\d*)/)
  if (!latMatch || !lngMatch) return null
  return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) }
}

function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
}

function isIos(): boolean {
  return typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/** Mobilde harita uygulaması seçicisini (Android) veya yerel haritayı (iOS) açar. */
export function buildMapOpenUrl(data: {
  mekanAdi: string
  adres: string
  haritaLink: string
  haritaEmbedUrl?: string
}): string {
  const query = encodeURIComponent(`${data.mekanAdi}, ${data.adres}`.trim())
  const coords = data.haritaEmbedUrl ? extractCoordsFromEmbedUrl(data.haritaEmbedUrl) : null
  const label = encodeURIComponent(data.mekanAdi)

  if (coords && isAndroid()) {
    const { lat, lng } = coords
    return `geo:${lat},${lng}?q=${lat},${lng}(${label})`
  }

  if (coords && isIos()) {
    const { lat, lng } = coords
    return `maps://?ll=${lat},${lng}&q=${label}`
  }

  if (data.haritaLink.trim()) {
    return data.haritaLink.trim()
  }

  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  }

  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export function shouldOpenMapInSameTab(): boolean {
  return isAndroid() || isIos()
}
