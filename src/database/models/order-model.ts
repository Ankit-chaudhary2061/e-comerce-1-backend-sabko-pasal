import { Table, Column, Model, DataType, PrimaryKey, Validate } from "sequelize-typescript";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

 @Column({
  type: DataType.STRING,
  allowNull: false,
  validate: {
    len: {
      args: [10, 10],
      msg: "Phone number must be 10 digits",
    },
    isNumeric: {
      msg: "Phone number must contain only numbers",
    }
  }
})
declare phoneNumber: string;


  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare shippingAddress: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM('pending','cancelled', 'delivered','ontheway', 'preparation'),
    allowNull: false,
    defaultValue:'pending'
  })
  declare orderStatus: string;


}

export default Order;
