

import { Model, Table, Column, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
    tableName: 'product',
    modelName: 'Product',
    timestamps: true
})
export class Product extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

   @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare productDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productPrice: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productTotalStockQty: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productImageUrl: string;
}
export default Product;
