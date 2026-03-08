import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { IconUpload, IconX } from '@tabler/icons-react'

type FileWithPreview = File & { preview: string }

interface DropzoneProps {
  className?: string
}

export default function Dropzone({ className = '' }: DropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [rejected, setRejected] = useState<FileRejection[]>([])

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ) as FileWithPreview[],
      ])
    }
    if (rejectedFiles?.length) {
      setRejected((previous) => [...previous, ...rejectedFiles])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 1024 * 1000,
    onDrop,
  })

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  const removeFile = (name: string) => {
    setFiles((current) => current.filter((file) => file.name !== name))
  }

  const removeAll = () => {
    setFiles([])
    setRejected([])
  }

  const removeRejected = (name: string) => {
    setRejected((current) => current.filter(({ file }) => file.name !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files?.length) return
    const formData = new FormData()
    files.forEach((file) => formData.append('file', file))
    formData.append('upload_preset', 'friendsbook')
    const url = import.meta.env.VITE_CLOUDINARY_URL
    if (url) {
      const data = await fetch(url, { method: 'POST', body: formData }).then((res) => res.json())
      console.log(data)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <IconUpload size={20} stroke={1.5} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      <section style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Preview</h2>
          <button type="button" onClick={removeAll}>
            Remove all files
          </button>
          <button type="submit" style={{ marginLeft: 'auto' }}>
            Upload to Cloudinary
          </button>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: 40, paddingBottom: 12, borderBottom: '1px solid #e5e5e5' }}>
          Accepted Files
        </h3>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 24, marginTop: 24, padding: 0, listStyle: 'none' }}>
          {files.map((file) => (
            <li key={file.name} style={{ position: 'relative', height: 128, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <img
                src={file.preview}
                alt={file.name}
                onLoad={() => URL.revokeObjectURL(file.preview)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }}
              />
              <button
                type="button"
                style={{ position: 'absolute', top: -12, right: -12, width: 28, height: 28, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => removeFile(file.name)}
                aria-label="Remove file"
              >
                <IconX size={16} />
              </button>
              <p style={{ marginTop: 8, fontSize: 12, color: '#737373' }}>{file.name}</p>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: 48, paddingBottom: 12, borderBottom: '1px solid #e5e5e5' }}>
          Rejected Files
        </h3>
        <ul style={{ marginTop: 24, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rejected.map(({ file, errors }) => (
            <li key={file.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, color: '#737373' }}>{file.name}</p>
                <ul style={{ margin: 4, paddingLeft: 20, fontSize: 12, color: '#f87171' }}>
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button type="button" onClick={() => removeRejected(file.name)}>
                remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </form>
  )
}
