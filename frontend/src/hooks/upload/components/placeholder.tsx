
import { Text } from '@/components/text'
import { PhotoIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

// ----------------------------------------------------------------------

export function UploadPlaceholder({
  isDragActive,
  text = 'PNG, JPG, GIF up to 5MB',
  onlyPhoto = false,
}: {
  text?: string
  isDragActive: boolean
  onlyPhoto?: boolean
}) {
  if (onlyPhoto) {
    return (
      <div
        className={clsx(
          "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 hover:border-indigo-800 dark:border-white",
          isDragActive && "border-indigo-800 ring-1"
        )}
      >
        <PhotoIcon
          aria-hidden="true"
          className="mx-auto size-16 text-gray-300"
        />
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white",
        isDragActive && "border-indigo-800 ring-1"
      )}
    >
      <div className="text-center">
        <PhotoIcon
          aria-hidden="true"
          className="mx-auto size-12 text-gray-300"
        />
        <div className="mt-4 flex text-sm/6">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
          >
            <Text>Upload a file</Text>
          </label>
          <Text className="pl-1">or drag and drop</Text>
        </div>
        <Text className="text-xs/5 text-gray-600">{text}</Text>
      </div>
    </div>
  );
}
