import { HOST_API } from "@/config-global";
import axiosInstance from "./axios";
import { paramCase } from "./change-case";

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

export async function UploadImage(image: File, uploadUrl: string) {
  let body = new FormData();
  body.append("files", image);
  try {
    const response = await axiosInstance.post(uploadUrl, body, config);
    return response.data as string;
  } catch (error) {
    return undefined;
  }
}

export async function UploadImages(
  images: any,
  newName: string,
  uploadUrl: string
) {
  let body = new FormData();
  let newNameParam = paramCase(newName);

  images.map((file: File, index: number) => {
    const timestamp = new Date().getTime() + index;
    const fileExtension = file.name.split(".").pop();
    const filename = `${newNameParam}-${timestamp}.${fileExtension}`;
    const renamedFile = new File([file], filename, { type: file.type });
    body.append("files", renamedFile);
  });

  try {
    return axiosInstance.post(uploadUrl, body, config);
  } catch (error) {
    return undefined;
  }
}
