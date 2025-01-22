import {
  type Sequelize,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { User } from "./user.js";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare accountName: string;
  declare balance: number;
  declare userId: ForeignKey<User["id"]> | null;
}

export function accountFactory(sequelize: Sequelize) {
  Account.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      accountName: {
        type: DataTypes.STRING,
        unique: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      updatedAt: false,
      tableName: "accounts",
    }
  );
  return Account;
}
