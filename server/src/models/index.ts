import sequelize from "../config/connection.js";
import { userFactory } from "./user.js";
import { categoryFactory } from "./category.js";
import { accountFactory } from "./account.js";
import { budgetFactory } from "./budget.js";
import { transationFactory } from "./transaction.js";

// initialize the models:

const User = userFactory(sequelize);
const Category = categoryFactory(sequelize);
const Account = accountFactory(sequelize);
const Budget = budgetFactory(sequelize);
const Transaction = transationFactory(sequelize);

// ----------------- Account - User: OneToMany association --------------------------

User.hasMany(Account, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "accounts",
});

Account.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ----------------- Transaction - User: OneToMany association --------------------------

User.hasMany(Transaction, {
  foreignKey: "userId",
});

Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ----------------- Transaction - Category: OneToMany association --------------------------

Category.hasMany(Transaction, {
  foreignKey: "categoryId",
});
Transaction.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "transaction",
});

// ----------------- Transaction - Account: OneToMany association --------------------------

Account.hasMany(Transaction, {
  foreignKey: "accountId",
});
Transaction.belongsTo(Account, {
  foreignKey: "accountId",
  as: "transaction",
});

// ----------------- Budget - User: OneToMany association --------------------------

User.hasMany(Budget, {
  foreignKey: "userId",
});
Budget.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ----------------- Budget - Category: OneToMany association --------------------------

Category.hasMany(Budget, {
  foreignKey: "categoryId",
});
Budget.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

export { User, Category, Account, Budget, Transaction };
