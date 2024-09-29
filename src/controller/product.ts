import express from "express";
import { Product } from "../entity/Product";
import path = require("path");
import { IMAGES_PATH } from "../constants/file";
import { deleteImages } from "../helpers/imageHandler";

export const getProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const products = await Product.getProducts(limit, offset);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getOne = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const product = await Product.getById(id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const addProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const values = req.body as Product;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imagePaths = files.map((file) =>
      path.join(IMAGES_PATH, file.filename)
    );
    values.images = imagePaths;

    await Product.add(values);
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const deleteProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.body;
    const product = await Product.getById(id);

    if (!product) res.sendStatus(400);

    const imagesToDelete = product.images;

    for (let i = 0; i < imagesToDelete.length; i++) {
      deleteImages(imagesToDelete[i]);
    }
    Product.deleteById(id);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const exists = await Product.getById(id);

    if (!exists) res.sendStatus(400);

    const updateValues = req.body as Product;
    const files = req.files as Express.Multer.File[];
    if (!files) {
      await Product.updateById(id, updateValues);
      return res.sendStatus(200);
    }

    const oldImages = exists.images;
    const newImages = files.map((image) => {
      return path.join(IMAGES_PATH, image.filename);
    });

    updateValues.images = newImages;

    await Product.updateById(id, updateValues);
    console.log(updateValues);

    for (let i = 0; i < oldImages.length; i++) {
      deleteImages(oldImages[i]);
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// import express from "express";
// import { Product } from "../entity/Product";
// import multer from "multer";

// interface NewProduct {
//   id: string;
//   name: string;
//   description: string;
//   price: string;
//   stock: number;
// }
// const upload = multer({ dest: "../images/" });
// export const addProduct = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { name, description, price, stock } = req.body as NewProduct;

//     const files = req.files as Express.Multer.File[];
//     const imageUrls = files.map((file) => `../images/${file.filename}`);

//     const productData = [
//       req.body,
//       imageUrls
//     ]

//   } catch (error) {}
// };
