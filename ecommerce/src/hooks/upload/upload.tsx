'use client'
import { Button } from '@/components/button'

// useDropzone
import { useDropzone } from 'react-dropzone'
import { UploadPlaceholder } from './components/placeholder'
import { MultiFilePreview } from './components/preview-multi-file'
import { RejectionFiles } from './components/rejection-files'
import type { UploadProps } from './types'
import { getFilesFromEvent } from './util'
import {
  DeleteButton,
  SingleFilePreview,
} from './components/preview-single-file'

// ----------------------------------------------------------------------

export function Upload({
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  onDrop,
  multiple = false,
  onSort,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    // disabled,
    getFilesFromEvent,
    onDrop,
    ...other,
  })

  const isArray = Array.isArray(value) && multiple

  const hasFile = !isArray && !!value

  const hasFiles = isArray && !!value.length

  // const hasError = isDragReject || !!error

  const renderMultiPreview = hasFiles && (
    <>
      <MultiFilePreview
        files={value}
        thumbnail={thumbnail}
        onRemove={onRemove}
        onSort={onSort}
      />

      {(onRemoveAll || onUpload) && (
        <div className="flex-end space-x-2">
          {onRemoveAll && (
            <Button outline onClick={onRemoveAll}>
              Remove all
            </Button>
          )}

          {onUpload && <Button onClick={onUpload}>Upload</Button>}
        </div>
      )}
    </>
  );

  return (
    <div>
      {!hasFiles && !hasFile && (
        <div {...getRootProps()}>
          {/* Single file */}
          {hasFile ? (
            <>
              <div className="flex min-w-0 gap-x-4">
                <SingleFilePreview file={value as File} />
                <DeleteButton onClick={onDelete} />
              </div>
            </>
          ) : (
            <>
              <input {...getInputProps()} />
              <UploadPlaceholder isDragActive={isDragActive} />
            </>
          )}
        </div>
      )}

      <RejectionFiles files={fileRejections as any} />

      {/* Multi files */}
      {renderMultiPreview}
      {hasFiles && (
        <div className="h-20 w-20" {...getRootProps()}>
          {/* Single file */}
          <input {...getInputProps()} />
          <UploadPlaceholder onlyPhoto isDragActive={isDragActive} />
        </div>
      )}
    </div>
  );
}
