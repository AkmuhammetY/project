import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  In,
} from "typeorm";
import { deleteImages } from "../helpers/imageHandler";

@Entity()
export class Product extends BaseEntity {
  constructor(init?: Partial<Product>) {
    super();
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @PrimaryColumn()
  name: string;

  @Column()
  description: string;

  @PrimaryColumn()
  price: string;

  @Column()
  stock: string;

  @Column("simple-array", { nullable: true })
  images: string[];

  static add(values: Partial<Product>) {
    return new Product(values).save();
  }
  static async getProducts(limit: number, offset: number): Promise<Product[]> {
    return await Product.find({
      take: limit,
      skip: offset,
    });
  }

  static getById(id: string) {
    return Product.findOneBy({ id });
  }

  static async getByIds(productIds: string[]) {
    const products = Product.findBy({ id: In(productIds) });
    return products;
  }

  static saveProduct(values: Product) {
    return new Product(values).save();
  }

  static updateById(id: string, updateValues: Partial<Product>) {
    return Product.update({ id }, updateValues);
  }

  static deleteById(id: string) {
    return Product.delete({ id });
  }

  static async bulkSave(ids: string[], values: Partial<Product[]>) {
    for (let i = 0; i < ids.length; i++) {
      await Product.createQueryBuilder()
        .update(Product)
        .set(values[i])
        .where("id = :id", { id: ids[i] })
        .execute();
    }
  }
}
