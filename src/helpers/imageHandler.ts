import { access, constants, mkdir, unlink } from "fs/promises";
import path from "path";

export const deleteImages = async (path: string) => {
  return await unlink(path);
};

export const makePath = (path: string) =>
  async function (_: any, __: any, cb: any) {
    try {
      await access(path, constants.F_OK);
    } catch (error) {
      await mkdir(path, { recursive: true });
    }

    cb(null, path);
  };

export const generateFilename = (
  _: any,
  file: Express.Multer.File,
  cb: any
) => {
  cb(null, Date.now() + path.extname(file.originalname));
};
