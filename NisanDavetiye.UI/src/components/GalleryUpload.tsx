import { type ChangeEvent, type FormEvent, useRef, useState } from 'react'
import { uploadGalleryPhotos } from '../api/client'
import { useInviteKey } from '../context/InviteContext'

const MAX_FILES = 10

export function GalleryUpload() {
  const inviteKey = useInviteKey()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])

    if (selected.length > MAX_FILES) {
      setFiles([])
      setStatus('error')
      setMessage(`Tek seferde en fazla ${MAX_FILES} fotoğraf yükleyebilirsiniz.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setFiles(selected)
    setStatus('idle')
    setMessage('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    if (files.length > MAX_FILES) {
      setStatus('error')
      setMessage(`Tek seferde en fazla ${MAX_FILES} fotoğraf yükleyebilirsiniz.`)
      return
    }

    setStatus('loading')
    setMessage('')
    try {
      const result = await uploadGalleryPhotos(inviteKey, files)
      setStatus('success')
      setMessage(
        result.uploadedCount === 1
          ? '1 fotoğraf başarıyla yüklendi. Teşekkürler!'
          : `${result.uploadedCount} fotoğraf başarıyla yüklendi. Teşekkürler!`,
      )
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Yükleme başarısız oldu.')
    }
  }

  return (
    <form className="ex-gallery__upload gallery__upload" onSubmit={handleSubmit}>
      <p className="gallery__upload-lead">
        Törende çektiğiniz anıları bizimle paylaşın — fotoğraflar doğrudan galerimize
        yüklenir. Tek seferde en fazla {MAX_FILES} fotoğraf yükleyebilirsiniz.
      </p>

      <label className="gallery__upload-picker">
        <span className="ex-btn ex-btn--outline">Fotoğraf Seç</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileChange}
        />
      </label>

      {files.length > 0 && status !== 'error' && (
        <p className="gallery__upload-count">
          {files.length} / {MAX_FILES} fotoğraf seçildi
        </p>
      )}

      <button
        type="submit"
        className="ex-btn ex-btn--primary gallery__upload-submit"
        disabled={files.length === 0 || status === 'loading'}
      >
        {status === 'loading' ? 'Yükleniyor…' : 'Fotoğrafları Yükle'}
      </button>

      {status === 'success' && <p className="gallery__upload-success">{message}</p>}
      {status === 'error' && <p className="gallery__upload-error">{message}</p>}
    </form>
  )
}
