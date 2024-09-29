import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User";
import { sign, verify } from "jsonwebtoken";
import { ROLES } from "../types";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const signJwt = (id: string) => {
  const SECRET = "NINETYSIX";
  const payload = { id };
  const options = { expiresIn: "30d" };

  return sign(payload, SECRET, options);
};

export const setCookie = (res: Response, jwtToken: string) => {
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  };

  res.cookie("token", jwtToken, options).sendStatus(200);
};

export const checkCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const SECRET = "NINETYSIX";
    const token = req.cookies.token;

    if (!token) return res.sendStatus(400);

    const { id } = verify(token, SECRET) as any;

    const user = await User.readById(id);

    if (!user) return res.sendStatus(404);

    req.user = {
      id: id,
      role: user.role as unknown as ROLES,
    };

    next();
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

export const isStaffAuthenticated = (...checkRoles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;
      if (!token) return res.sendStatus(401);

      const { id } = verify(token, "NINETYSIX") as any;

      const user = await User.readById(id);
      if (!user) return res.sendStatus(404);

      if (checkRoles.length > 0 && !checkRoles.includes(user.role)) {
        return res.sendStatus(403);
      }

      if (user.role === ROLES.USER) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };
};
