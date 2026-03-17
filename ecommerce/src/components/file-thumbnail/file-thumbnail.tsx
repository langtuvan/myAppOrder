import { fileThumbnailClasses } from './classes'
import { fileData, fileThumb, fileFormat } from './utils'
import { RemoveButton, DownloadButton } from './action-buttons'

import type { FileThumbnailProps } from './types'

import { Text } from '../text'
import { HOST_API_BASE } from "@/config-global";
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

// ----------------------------------------------------------------------

export function FileThumbnail({
  className,
  file,
  tooltip,
  onRemove,
  imageView,
  onDownload,
  ...other
}: FileThumbnailProps) {
  const previewUrl =
    typeof file === "string"
      ? `${HOST_API_BASE}${file}`
      : URL.createObjectURL(file);

  const { name, path } = fileData(file)

  const format = fileFormat((name as string) || (path as string))

  const renderImg = (
    <PhotoProvider>
      <PhotoView src={previewUrl}>
        <span className="block shrink-0">
          <img alt={name} src={previewUrl} className="size-10 rounded-md" />
        </span>
      </PhotoView>
    </PhotoProvider>
  )

  const renderIcon = (
    <div className="relative h-6 w-6 cursor-pointer rounded-sm">
      <img
        src={fileThumb(format)}
        className="h-full w-full rounded-sm object-cover"
      />
    </div>
  );

  const renderContent = (
    <div
      className="group flex w-fit items-center justify-between space-x-0 rounded-xl border border-gray-300  p-1 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      {...other}
    >
      <span className="flex min-w-0 flex-1 items-center space-x-3">
        {format === 'image' && imageView ? renderImg : renderIcon}

        {/* <span className="block min-w-0 flex-1">
          <span className="line-clamp-2 block text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </span>
        </span> */}
      </span>
      {onRemove && (
        <div className="inline-flex size-10 shrink-0 items-center justify-center">
          <RemoveButton
            onClick={onRemove}
            aria-hidden="true"
            className="size-5 text-red-400 group-hover:text-gray-500"
          />
        </div>
      )}

      {onDownload && (
        <span className="inline-flex size-10 shrink-0 items-center justify-center">
          <DownloadButton
            onClick={onDownload}
            className="size-5 text-gray-400 group-hover:text-gray-500"
            //className={fileThumbnailClasses.downloadBtn}
            // sx={slotProps?.downloadBtn}
          />
        </span>
      )}
    </div>
  )

  // if (tooltip) {
  //   return (
  //     <Tooltip
  //       arrow
  //       title={name}
  //       slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -12] } }] } }}
  //     >
  //       {renderContent}
  //     </Tooltip>
  //   );
  // }

  return renderContent
}
