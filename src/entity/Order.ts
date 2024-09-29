import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@Entity()
export class Order extends BaseEntity {
  constructor(init?: Partial<Order>) {
    super();
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  static async getAll(
    limit: number,
    offset: number
  ): Promise<[Order[], number]> {
    return await Order.findAndCount({
      relations: ["user", "products"],
    });
  }

  static async getById(id: string) {
    const result = await Order.createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.products", "product")
      .where("order.id = :id", { id })
      .getOne();
    return result;
  }

  static async createOrder(userId: string, productIds: string[]) {
    const products = await Product.getByIds(productIds);
    const user = await User.readById(userId);

    const newOrder = new Order();
    newOrder.products = products;
    newOrder.user = user;

    products.forEach(async (product) => {
      product.stock = (Number(product.stock) - 1).toString();
      await Product.updateById(product.id, product);
    });

    return Order.save(newOrder);
  }

  static async cancelOrder(id: string) {
    const order = await Order.getById(id);

    const products = order.products;

    const productIds = [];
    products.forEach((product) => {
      productIds.push(product.id);
      product.stock = (Number(product.stock) + 1).toString();
    });
    await Product.bulkSave(productIds, products);
    return Order.delete({ id });
  }

  static updateOrder(id: string, updateValues: Partial<Order>) {
    return Order.update({ id }, updateValues);
  }
}
