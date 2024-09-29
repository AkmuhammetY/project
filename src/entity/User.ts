import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { ROLES } from "../types";
import { Product } from "./Product";
import { Order } from "./Order";

@Entity()
export class User extends BaseEntity {
  constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @PrimaryColumn({
    unique: true,
    length: 20,
  })
  username: string;

  @PrimaryColumn()
  password: string;

  @Column({
    type: "enum",
    enum: ROLES,
    default: ROLES.USER,
  })
  role: ROLES;

  @OneToMany(() => Order, (order) => order)
  orders: Order[];

  static newUser(values: Partial<User>) {
    return new User(values).save();
  }

  static readByUsername(username: string) {
    return User.findOneBy({ username });
  }

  static readById(id: string) {
    return User.findOneBy({ id });
  }

  static async findOrder(userId: string) {
    const result = await Order.createQueryBuilder("order")
      .leftJoinAndSelect("order.products", "product")
      .where("order.userId = :userId", { userId })
      .getMany();
    return result;
  }

  static async doesExist(username: string): Promise<boolean> {
    const user = await User.findOneBy({ username });
    return !!user;
  }
}
