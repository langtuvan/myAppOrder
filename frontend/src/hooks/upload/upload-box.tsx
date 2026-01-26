import { useDropzone } from 'react-dropzone'
import type { UploadProps } from './types'
import { UploadPlaceholder } from './components/placeholder'

// ----------------------------------------------------------------------

export function UploadBox({
  placeholder,
  error,
  disabled,

  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      disabled,
      ...other,
    })

  const hasError = isDragReject || error

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      {placeholder || <UploadPlaceholder isDragActive={isDragActive} />}
    </div>
  )
}
