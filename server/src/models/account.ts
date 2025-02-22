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
  declare plaidAccountId: string;
  declare accountName: string;
  declare balanceCurrent: number | null;
  declare balanceAvailable: number | null;
  declare type: string | null;
  declare subtype: string | null;
  declare userId: ForeignKey<User["id"]> | null;
}

export function accountFactory(sequelize: Sequelize) {
  Account.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      // this is the id coming from the plaid api for the account
      plaidAccountId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      accountName: {
        type: DataTypes.STRING,
        unique: false,
      },

      balanceCurrent: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      balanceAvailable: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subtype: {
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
    },
    {
      sequelize,
      timestamps: true,
      tableName: "accounts",
    }
  );
  return Account;
}
