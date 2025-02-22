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

export class PlaidAccount extends Model<
  InferAttributes<PlaidAccount>,
  InferCreationAttributes<PlaidAccount>
> {
  declare id: CreationOptional<number>;
  declare accessToken: string;
  declare itemId: string;
  declare userId: ForeignKey<User["id"]> | null;
}

export function PlaidAccountFactory(sequelize: Sequelize) {
  PlaidAccount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      accessToken: {
        type: DataTypes.STRING,
        unique: true,
      },
      itemId: {
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
      updatedAt: false,
      tableName: "plaid_accounts",
    }
  );
  return PlaidAccount;
}
