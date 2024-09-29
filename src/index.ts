import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { DataBase } from "./data-source";
import { productRouter } from "./router/product";
import { userRouter } from "./router/user";
import { ordersRouter } from "./router/order";
const main = async () => {
  DataBase.initialize().then((async) => {
    const app = express();
    app.use(bodyParser.json(), cookieParser());
    app.use(
      cors({
        origin: "http://localhost",
        credentials: true,
      })
    );

    app.use(productRouter, userRouter, ordersRouter);
    app.listen(3001, () => {
      console.log("Server running on port: 3001");
    });
  });
};

main();
