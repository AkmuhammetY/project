import express from "express";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
import { Order } from "../entity/Order";

export const listOrders = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = 10;
    const offset = page * 10;

    const [orders, total] = await Order.getAll(limit, offset);
    res.json(orders).status(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const listOne = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) res.sendStatus(400);

    const order = await Order.getById(id);
    if (!order) res.sendStatus(400);

    res.json(order).status(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const createOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.user;
    const { products } = req.body;

    await Order.createOrder(id, products);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const deleteOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.body;
    const _order = Order.getById(id);
    if (!_order) res.sendStatus(400);

    Order.cancelOrder(id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
