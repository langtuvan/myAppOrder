import { diskStorage } from 'multer';
import { parse, extname } from 'path';
// Multer configuration
export const multerOptions = (destination: string) => {
  destination = `./client${destination}`;
  return {
    storage: diskStorage({
      destination,
      filename: (req: any, file: any, cb: any) => {
        const filename: string = parse(file.originalname).name;
        const extension = extname(file.originalname); // Get the file extension
        cb(null, `${filename}${extension}`);
      },
    }),
  };
};
