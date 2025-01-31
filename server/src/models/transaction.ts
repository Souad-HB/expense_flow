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
import { Category } from "./category.js";

type transactionType = "Income" | "Expense";
type frequency = "Weekly" | "Bi-Weekly" | "Monthly" | "Yearly";
export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare transactionType: transactionType;
  declare amount: number;
  declare transactionDate: Date;
  declare isRecurring: boolean;
  declare frequency?: frequency; // weekly/biweekly
  declare notes?: string;
  declare userId: ForeignKey<User["id"]> | null;
  declare accountId: ForeignKey<Account["id"]> | null; // where is this transaction being pulled from
  declare categoryId?: ForeignKey<Category["id"]> | null;
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
      transactionType: {
        type: DataTypes.ENUM("Income", "Expense"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.ENUM("Weekly", "Bi-Weekly", "Monthly", "Yearly"),
        allowNull: true,
      },
      notes: {
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Category,
          key: "id",
        },
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
