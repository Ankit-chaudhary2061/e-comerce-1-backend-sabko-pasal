import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: "payment",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM('cod','esewa','khalti'),
    allowNull: false,
    
  })
  declare paymentMethod: string; // clean name for code
   @Column({
    type: DataType.ENUM('unpaid','paid'),
    allowNull: false,
    defaultValue:'unpaid'
  })
  declare paymentStatus: string;
   @Column({
    type: DataType.STRING
   
    
  })
  declare pidx: string; 
}

export default Payment;
  