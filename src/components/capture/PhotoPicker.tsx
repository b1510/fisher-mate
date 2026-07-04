import { useRef, useState } from 'react'

interface PhotoPickerProps {
  onPhotoSelected: (file: File) => void
}

export function PhotoPicker({ onPhotoSelected }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    onPhotoSelected(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-md border border-dashed border-neutral-400 dark:border-neutral-600 py-6 text-sm font-medium text-neutral-600 dark:text-neutral-400"
      >
        {previewUrl ? 'Changer la photo' : '📷 Ajouter une photo'}
      </button>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Aperçu de la prise"
          className="rounded-md max-h-64 w-full object-cover"
        />
      )}
    </div>
  )
}
