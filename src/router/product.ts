import { Router } from "express";
import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controller/product";
import { generateFilename, makePath } from "../helpers/imageHandler";
import { IMAGES_PATH } from "../constants/file";
import multer from "multer";
import { isStaffAuthenticated } from "../helpers/auth";
import { ROLES } from "../types";
const router = Router();

const storage = multer.diskStorage({
  destination: makePath(IMAGES_PATH),
  filename: generateFilename,
});

const upload = multer({ storage });

router.get(
  "/products",
  isStaffAuthenticated(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  getProducts
);
router.post(
  "/product",
  isStaffAuthenticated(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  upload.array("files", 5),
  addProduct
);

router.put(
  "/products/:id",
  isStaffAuthenticated(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  upload.array("files", 5),
  updateProduct
);
router.delete(
  "/products",
  isStaffAuthenticated(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  deleteProduct
);

export { router as productRouter };
