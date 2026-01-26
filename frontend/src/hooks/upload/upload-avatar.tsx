import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { RejectionFiles } from "./components/rejection-files";

import type { UploadProps } from "./types";

import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Text } from "@/components/text";

// ----------------------------------------------------------------------

export function UploadAvatar({
  error,
  value,
  disabled,
  helperText,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    disabled,
    accept: { "image/*": [] },
    ...other,
  });

  const hasFile = !!value;

  const hasError = isDragReject || !!error;

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
    }
  }, [value]);

  const renderPreview = hasFile && <Image alt="avatar" src={preview} />;

  const renderPlaceholder = (
    <div>
      <div className="col-span-full">
        <label
          htmlFor="photo"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Photo
        </label>
        <div className="mt-2 flex items-center gap-x-3">
          <UserCircleIcon
            aria-hidden="true"
            className="size-12 text-gray-300"
          />
          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Change
          </button>
        </div>
      </div>

      <Text>{hasFile ? "Update photo" : "Upload photo"}</Text>
    </div>
  );

  const renderContent = (
    <div>
      {renderPreview}
      {renderPlaceholder}
    </div>
  );

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {renderContent}
      </div>
      {helperText && helperText}

      {/* <RejectionFiles files={fileRejections} /> */}
    </>
  );
}
