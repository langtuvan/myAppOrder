'use client'

import { fileData, FileThumbnail } from '@/components/file-thumbnail'
import type { MultiFilePreviewProps } from '../types'
import { Button } from '@/components/button'
import { Text } from '@/components/text'
import { PhotoProvider } from 'react-photo-view'
//
import React from 'react'

// ----------------------------------------------------------------------

function isArrayOfObjects(arr: any) {
  return (
    Array.isArray(arr) &&
    arr.every((element) => typeof element === 'object' && element !== null)
  )
}

export function MultiFilePreview({
  thumbnail,
  onRemove,
  lastNode,
  firstNode,
  files = [],
}: MultiFilePreviewProps) {
  const renderFirstNode = firstNode && <div>{firstNode}</div>

  const renderLastNode = lastNode && <div>{lastNode}</div>

  // Check if the array has a File item
  const hasFile = files.some((item) => item instanceof File)

  if (hasFile) {
    return (
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:gap-2 md:grid-cols-5">
        {renderFirstNode}

        {files.map((file, index) => {
          const { name, size } = fileData(file)

          if (thumbnail) {
            return (
              <li key={index} className="select-none">
                <FileThumbnail
                  //tooltip
                  imageView
                  file={file}
                  onRemove={() => onRemove?.(index)}
                  // {...slotProps?.thumbnail}
                />
              </li>
            )
          }

          return (
            <div key={index}>
              {/* <FileThumbnail file={file} {...slotProps?.thumbnail} /> */}
              <FileThumbnail file={file} onRemove={() => onRemove?.(file)} />

              <Text>name</Text>

              {onRemove && (
                <Button onClick={() => onRemove(index)}>Remove</Button>
              )}
            </div>
          );
        })}

        {renderLastNode}
      </ul>
    )
  }

  return (
    <ul
      role="list"
      className="mt-4 flex flex-row flex-wrap items-center justify-start gap-2"
    >
      {renderFirstNode}
      <PhotoProvider>
        {files.map((file, index) => {
          const { name, size } = fileData(file)

          if (thumbnail) {
            return (
              <li key={file?.id || file?.name || file} className="select-none">
                <FileThumbnail
                  imageView
                  file={file}
                  onRemove={() => onRemove?.(index)}
                />
              </li>
            )
          }

          return (
            <li key={index} className="select-none">
              <FileThumbnail file={file} onRemove={() => onRemove?.(file)} />

              <Text>{name}</Text>

              {onRemove && (
                <Button onClick={() => onRemove(index)}>Remove</Button>
              )}
            </li>
          )
        })}
      </PhotoProvider>
      {renderLastNode}
    </ul>
  )
}
