
import type { SingleFilePreviewProps } from '../types'
import { Button } from '@/components/button'
import { TrashIcon } from '@heroicons/react/24/outline'
import {  SVGProps } from 'react'
import { HOST_API_BASE } from "@/config-global";
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

// ----------------------------------------------------------------------

export function SingleFilePreview({ file }: SingleFilePreviewProps) {
  const fileName = typeof file === 'string' ? file : file.name

  const previewUrl =
    typeof file === "string"
      ? `${HOST_API_BASE}${file}`
      : URL.createObjectURL(file);



  return (
    <div className="relative h-6 w-6 cursor-pointer rounded-sm">
      <PhotoProvider>
        <PhotoView src={previewUrl}>
          <img
            src={previewUrl}
            alt={fileName}
            className="h-full w-full rounded-sm object-cover"
          />
        </PhotoView>
      </PhotoProvider>
    </div>
  )
}

// ----------------------------------------------------------------------

export function DeleteButton({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <TrashIcon
      className="mt-2 h-5 w-5 cursor-pointer text-gray-700 hover:text-red-500"
      {...props}
    />
  )
}
