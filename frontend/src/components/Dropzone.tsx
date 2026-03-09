import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { IconUpload, IconX } from '@tabler/icons-react'

type FileWithPreview = File & { preview: string }

interface DropzoneProps {
  className?: string
  onPhotoUrl: (url: string | null) => void
}

export default function Dropzone({ className = '', onPhotoUrl }: DropzoneProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null)
  const [uploading, setUploading] = useState(false)

  const uploadToCloudinary = useCallback(async (f: File): Promise<string | null> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error('Missing Cloudinary config')
    }

    const formData = new FormData()
    formData.append('file', f)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.error?.message || 'Cloudinary upload failed')
    }

    return data.secure_url ?? null
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const f = acceptedFiles[0]
      if (!f) return
      const fileWithPreview = Object.assign(f, { preview: URL.createObjectURL(f) }) as FileWithPreview
      setFile(fileWithPreview)
      setUploading(true)
      onPhotoUrl(null)
      try {
        const url = await uploadToCloudinary(f)
        if (url) onPhotoUrl(url)
      } finally {
        setUploading(false)
      }
    },
    [onPhotoUrl, uploadToCloudinary]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
    disabled: uploading,
  })

  useEffect(() => {
    return () => {
      if (file?.preview) URL.revokeObjectURL(file.preview)
    }
  }, [file])

  const removeFile = useCallback(() => {
    if (file?.preview) URL.revokeObjectURL(file.preview)
    setFile(null)
    onPhotoUrl(null)
  }, [file, onPhotoUrl])

  return (
    <div>
      {!file && (
        <div {...getRootProps({ className })}>
          <input {...getInputProps()} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <IconUpload size={20} stroke={1.5} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag & drop a photo here, or click to select</p>
            )}
          </div>
        </div>
      )}
      {file && (
        <section style={{ marginTop: 0 }}>
          <div style={{ position: 'relative', display: 'inline-block', height: 128, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <img
              src={file.preview}
              alt={file.name}
              onLoad={() => URL.revokeObjectURL(file.preview)}
              style={{ width: 'auto', height: '100%', objectFit: 'contain', borderRadius: 8 }}
            />
            <button
              type="button"
              style={{ position: 'absolute', top: -12, right: -12, width: 28, height: 28, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={removeFile}
              aria-label="Remove photo"
              disabled={uploading}
            >
              <IconX size={16} />
            </button>
          </div>
          {uploading && <p style={{ marginTop: 8, fontSize: 12, color: '#737373' }}>Uploading...</p>}
          {!uploading && <p style={{ marginTop: 8, fontSize: 12, color: '#737373' }}>{file.name}</p>}
        </section>
      )}
    </div>
  )
}
