import {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { User } from "./user.js";
import { Category } from "./category.js";

export class Budget extends Model<
  InferAttributes<Budget>,
  InferCreationAttributes<Budget>
> {
  declare id: CreationOptional<number>;
  declare startDate: Date;
  declare endDate: Date;
  declare budgetedAmount: number;
  declare actualAmount: number;
  declare difference: number;
  declare userId: ForeignKey<User["id"]>;
  declare categoryId: ForeignKey<Category["id"]>;
}

export function budgetFactory(sequelize: Sequelize) {
  Budget.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      budgetedAmount: {
        type: DataTypes.FLOAT,
      },
      actualAmount: {
        type: DataTypes.FLOAT,
      },
      difference: {
        type: DataTypes.FLOAT,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: Category,
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "budgets",
    }
  );
  return Budget;
}
