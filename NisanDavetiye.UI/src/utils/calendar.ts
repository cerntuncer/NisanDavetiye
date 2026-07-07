import type { MouseEvent } from 'react'
import type { Davetiye } from '../types'

function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
}

function isIos(): boolean {
  return typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function eventStart(iso: string): Date {
  return new Date(iso)
}

function eventEnd(iso: string): Date {
  return new Date(eventStart(iso).getTime() + 4 * 60 * 60 * 1000)
}

function formatUtc(d: Date): string {
  if (Number.isNaN(d.getTime())) return ''
  return `${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function eventSummary(data: Davetiye): string {
  return `${data.gelinAdi} & ${data.damatAdi} Nişan`
}

function eventLocation(data: Davetiye): string {
  return `${data.mekanAdi}, ${data.adres}`.replace(/,\s*$/, '')
}

function buildIcsContent(data: Davetiye): string {
  const start = eventStart(data.etkinlikTarihi)
  const end = eventEnd(data.etkinlikTarihi)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NisanDavetiye//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nisandavetiye-${formatUtc(start)}@nisan`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeIcs(eventSummary(data))}`,
    `DESCRIPTION:${escapeIcs(data.mekanAdi)}`,
    `LOCATION:${escapeIcs(eventLocation(data))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/** Google Calendar; dates içindeki / encode edilmemeli. */
export function buildGoogleCalendarUrl(data: Davetiye): string {
  const dates = `${formatUtc(eventStart(data.etkinlikTarihi))}/${formatUtc(eventEnd(data.etkinlikTarihi))}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventSummary(data),
    details: data.mekanAdi,
    location: eventLocation(data),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}&dates=${dates}`
}

export function shouldOpenCalendarInSameTab(): boolean {
  return isAndroid() || isIos()
}

export function buildCalendarHref(data: Davetiye): string {
  if (shouldOpenCalendarInSameTab()) {
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcsContent(data))}`
  }
  return buildGoogleCalendarUrl(data)
}

export function handleCalendarClick(
  data: Davetiye,
  event: MouseEvent<HTMLAnchorElement>,
): void {
  if (!shouldOpenCalendarInSameTab()) return

  event.preventDefault()
  const blob = new Blob([buildIcsContent(data)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'nis-davetiye.ics'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
