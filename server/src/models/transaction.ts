import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { User } from "./user.js";
import { Account } from "./account.js";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare amount: number;
  declare transactionDate: string;
  declare userId: ForeignKey<User["id"]> | null;
  declare accountId: ForeignKey<Account["id"]>; // where is this transaction being pulled from
  declare category?: string | null;
  declare categoryIcon?: string | null;
  declare merchant?: string | null;
}

export function transactionFactory(sequelize: Sequelize) {
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.STRING,
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
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Account,
          key: "id",
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoryIcon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      merchant: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "transactions",
    }
  );
  return Transaction;
}
