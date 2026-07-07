import type { Davetiye, DavetiyeAdmin, RsvpInput, RsvpRecord } from '../types'

const API = '/api'
const ADMIN_KEY_HEADER = 'X-Admin-Key'
const DAVET_KEY_HEADER = 'X-Davet-Key'

export async function fetchDavetiye(inviteKey: string): Promise<Davetiye> {
  const res = await fetch(`${API}/davetiye/${encodeURIComponent(inviteKey)}`)
  if (!res.ok) throw new Error('Davetiye yüklenemedi')
  return res.json()
}

export async function fetchDavetiyeAdmin(adminKey: string): Promise<DavetiyeAdmin> {
  const res = await fetch(`${API}/davetiye`, {
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) throw new Error('Davetiye yüklenemedi')
  return res.json()
}

export async function submitRsvp(inviteKey: string, data: RsvpInput): Promise<void> {
  const res = await fetch(`${API}/rsvp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [DAVET_KEY_HEADER]: inviteKey,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Yanıtınız gönderilemedi')
  }
}

export async function uploadGalleryPhotos(
  inviteKey: string,
  files: File[],
): Promise<{ uploadedCount: number; fileNames: string[] }> {
  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }

  const res = await fetch(`${API}/galeri/upload`, {
    method: 'POST',
    headers: { [DAVET_KEY_HEADER]: inviteKey },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Fotoğraflar yüklenemedi')
  }

  return res.json()
}

export async function downloadGalleryZip(adminKey: string): Promise<Blob> {
  const res = await fetch(`${API}/admin/galeri/export`, {
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Galeri indirilemedi')
  }
  return res.blob()
}

export async function deleteGalleryPhoto(id: number, adminKey: string): Promise<void> {
  const res = await fetch(`${API}/admin/galeri/${id}`, {
    method: 'DELETE',
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Fotoğraf silinemedi')
  }
}

export async function deleteAllUploadedGalleryPhotos(
  adminKey: string,
): Promise<{ deletedCount: number }> {
  const res = await fetch(`${API}/admin/galeri/uploaded`, {
    method: 'DELETE',
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Fotoğraflar silinemedi')
  }
  return res.json()
}

export async function fetchRsvpList(adminKey: string): Promise<RsvpRecord[]> {
  const res = await fetch(`${API}/rsvp`, {
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) throw new Error('Katılım yanıtları alınamadı')
  return res.json()
}

export async function deleteRsvp(id: number, adminKey: string): Promise<void> {
  const res = await fetch(`${API}/rsvp/${id}`, {
    method: 'DELETE',
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) throw new Error('Kayıt silinemedi')
}

export async function exportRsvpExcel(adminKey: string): Promise<Blob> {
  const res = await fetch(`${API}/rsvp/export`, {
    headers: { [ADMIN_KEY_HEADER]: adminKey },
  })
  if (!res.ok) throw new Error('Excel indirilemedi')
  return res.blob()
}

export async function updateDavetiye(data: DavetiyeAdmin, adminKey: string): Promise<DavetiyeAdmin> {
  const res = await fetch(`${API}/davetiye`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      [ADMIN_KEY_HEADER]: adminKey,
    },
    body: JSON.stringify({
      gelinAdi: data.gelinAdi,
      damatAdi: data.damatAdi,
      basHarpler: data.basHarpler,
      baslik: data.baslik,
      hosgeldinMetni: data.hosgeldinMetni,
      etkinlikTarihi: data.etkinlikTarihi,
      mekanAdi: data.mekanAdi,
      adres: data.adres,
      haritaEmbedUrl: data.haritaEmbedUrl,
      haritaLink: data.haritaLink,
      kapakGorselUrl: data.kapakGorselUrl,
      ciftFotoUrl: data.ciftFotoUrl,
      acilisVideoUrl: data.acilisVideoUrl,
      muzikUrl: data.muzikUrl,
      zarfArkaPlanUrl: data.zarfArkaPlanUrl,
      galeriDriveKlasorUrl: data.galeriDriveKlasorUrl,
      timeline: data.timeline,
      galeri: data.galeri,
    }),
  })
  if (!res.ok) throw new Error('Davetiye güncellenemedi')
  return res.json()
}
