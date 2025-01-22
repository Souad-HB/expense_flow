import sequelize from "../config/connection.js";
import { userFactory } from "./user.js";
import { categoryFactory } from "./category.js";
import { accountFactory } from "./account.js";
import { budgetFactory } from "./budget.js";
import { transactionFactory } from "./transaction.js";

// initialize the models:

const User = userFactory(sequelize);
const Category = categoryFactory(sequelize);
const Account = accountFactory(sequelize);
const Budget = budgetFactory(sequelize);
const Transaction = transactionFactory(sequelize);

// ----------------- Account - User: OneToMany association --------------------------

User.hasMany(Account, {
  foreignKey: "userId",
  as: "accounts",
});

Account.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ----------------- Transaction - User: OneToMany association --------------------------

User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transactions",
});

Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ----------------- Transaction - Category: OneToMany association --------------------------

Category.hasMany(Transaction, {
  foreignKey: "categoryId",
  as: "transactions",
});
Transaction.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// ----------------- Transaction - Account: OneToMany association --------------------------

Account.hasMany(Transaction, {
  foreignKey: "accountId",
  as: "transactions",
});
Transaction.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account",
});

// ----------------- Budget - User: OneToMany association --------------------------

User.hasMany(Budget, {
  foreignKey: "userId",
  as: "budgets",
});
Budget.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ----------------- Budget - Category: OneToMany association --------------------------

Category.hasMany(Budget, {
  foreignKey: "categoryId",
  as: "budgets",
});
Budget.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

export { User, Category, Account, Budget, Transaction };
