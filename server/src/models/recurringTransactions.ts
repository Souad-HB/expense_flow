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
import { Account } from "./account.js";

export class RecurringTransactions extends Model<
  InferAttributes<RecurringTransactions>,
  InferCreationAttributes<RecurringTransactions>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare streamId: string;
  declare accountId: ForeignKey<Account["plaidAccountId"]>;
  declare category: string;
  declare subCategory: string | null;
  declare categoryId: string;
  declare merchantName: string | null;
  declare description: string;
  declare amount: number;
  declare averageAmount: number;
  declare frequency: string;
  declare firstDate: string; // first date the transaction started
  declare lastDate: string; // last date transaction was taken
  declare predictedNextDate: string | null; // next predicted date for the transaction to be taken
  declare status: string;
  declare transactionId: string[]; // store as json array
  declare type: "inflow" | "outflow";
  declare isActive: boolean; // whether the transaction stream is still active
}

export function RecurringTransactionsFactory(sequelize: Sequelize) {
  RecurringTransactions.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
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
          key: "plaidAccountId",
        },
      },
      streamId: {
        type: DataTypes.STRING,
        unique: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      merchantName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      averageAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      predictedNextDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("inflow", "outflow"),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "recurring-_transactions",
    }
  );
  return RecurringTransactions;
}
