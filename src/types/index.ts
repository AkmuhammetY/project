export enum ROLES {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  USER = "user",
}

export class ProductDTO {
  name: string;
  description: string;
  price: string;
  stock: number;
}

export type UserPayload = {
  id: string;
  role: ROLES;
};

declare module "express-serve-static-core" {
  interface Request {
    user: UserPayload;
  }
}
