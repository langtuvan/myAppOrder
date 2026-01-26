// ----------------------------------------------------------------------

import { SVGProps } from 'react'
import { Button } from '../button'
import {
  TrashIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export function DownloadButton({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <ArrowDownTrayIcon
      className="mt-2 h-5 w-5 cursor-pointer text-gray-700 hover:text-indigo-500"
      {...props}
    />
  )
}

// ----------------------------------------------------------------------

export function RemoveButton({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <XMarkIcon
      className="mt-2 h-5 w-5 cursor-pointer text-red-900 hover:text-gray-500"
      {...props}
    />
  )
}
