/** Google Drive klasör linkinden veya ham ID'den klasör kimliğini çıkarır. */
export function extractDriveFolderId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  return match?.[1] ?? null
}

export function buildDriveFolderViewUrl(folderId: string) {
  return `https://drive.google.com/drive/folders/${folderId}`
}

export function buildDriveFolderEmbedUrl(folderId: string) {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`
}
