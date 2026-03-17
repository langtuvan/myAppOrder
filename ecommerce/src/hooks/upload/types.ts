import type { DropzoneOptions } from "react-dropzone";

export interface Accept extends Pick<DropzoneOptions, "accept"> {}

// ----------------------------------------------------------------------

export type FileUploadType = File | string | null | any;

export type FilesUploadType = (File | string | any)[];

export type SingleFilePreviewProps = {
  file: File | string;
};

export type MultiFilePreviewProps = {
  files: FilesUploadType;
  onSort: UploadProps["onSort"];
  lastNode?: React.ReactNode;
  firstNode?: React.ReactNode;
  onRemove: UploadProps["onRemove"];
  thumbnail: UploadProps["thumbnail"];

  // slotProps?: {
  //   thumbnail?: Omit<FileThumbnailProps, 'file'>;
  // };
};

export type UploadProps = DropzoneOptions & {
  error?: boolean;
  thumbnail?: boolean;
  onDelete?: () => void;
  onUpload?: () => void;
  onRemoveAll?: () => void;
  helperText?: React.ReactNode;
  placeholder?: React.ReactNode;
  value?: FileUploadType | FilesUploadType;
  onSort?: (items: any[]) => void;
  onRemove?: (file: File | string | number) => void;
};
