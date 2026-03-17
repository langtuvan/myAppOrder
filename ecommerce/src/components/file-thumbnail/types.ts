// ----------------------------------------------------------------------

export interface ExtendFile extends File {
  path?: string
  preview?: string
  lastModifiedDate?: Date
}

export type FileThumbnailProps = {
  className?: string
  tooltip?: boolean
  file: File | string
  imageView?: boolean
  // sx?: SxProps<Theme>;
  onDownload?: () => void
  onRemove?: () => void
  // slotProps?: {
  //   img?: SxProps<Theme>;
  //   icon?: SxProps<Theme>;
  //   removeBtn?: SxProps<Theme>;
  //   downloadBtn?: SxProps<Theme>;
  // };
}
