import type { FileRejection } from "react-dropzone";

import { fData } from "@/utils/format-number";

import { fileData } from "@/components/file-thumbnail/utils";
import { ErrorMessage } from "@/components/fieldset";

// ----------------------------------------------------------------------

type Props = {
  files: FileRejection[];
};

export function RejectionFiles({ files }: Props) {
  if (!files.length) {
    return null;
  }

  return (
    <div>
      {files.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <div className="flex flex-1">
            <ErrorMessage>
              {path} - {size ? fData(size) : ""}
            </ErrorMessage>

            {errors.map((error) => (
              <ErrorMessage>- {error.message}</ErrorMessage>
            ))}
          </div>
        );
      })}
    </div>
  );
}
