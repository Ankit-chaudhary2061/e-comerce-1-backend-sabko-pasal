import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: "categories",
  modelName: "Category",
  timestamps: true,
})
class Category extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "caategoryName", // actual column in DB
  })
  declare categoryName: string; // clean name for code
}

export default Category;
