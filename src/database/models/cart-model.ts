import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: "cart",
  modelName: "Cart",
  timestamps: true,
})
class Cart extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
   
  })
  declare quantity: number; // clean name for code
}

export default Cart;
