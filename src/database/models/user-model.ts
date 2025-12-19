import { Model, Table, Column, DataType, PrimaryKey } from "sequelize-typescript";
import { UserRole } from "../../middleware/auth-middleware";

@Table({
    tableName: 'users',
    modelName: 'User',
    timestamps: true
})
export class User extends Model {

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
    declare username: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique : true
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;
      @Column({
    type: DataType.ENUM("admin", "customer"),
    defaultValue: "customer",
  })
  declare role: UserRole;
}
