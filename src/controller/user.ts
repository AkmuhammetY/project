import express from "express";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { signJwt, setCookie } from "../helpers/auth";

const round = 10;

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { username, password } = req.body;

    const user = await User.readByUsername(username);
    if (!user) return res.sendStatus(401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.sendStatus(401);

    const jwtToken = signJwt(user.id);

    setCookie(res, jwtToken);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const values = req.body as User;

    if (await User.doesExist(values.username)) {
      return res.status(400).json({ message: "User exists!" });
    }

    values.password = await bcrypt.hash(values.password, round);
    await User.newUser(values);

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

export const findYourOrders = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.user;

    const userOrders = await User.findOrder(id);
    res.json(userOrders);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
