import { seedAccounts } from "./account-seeds.js";
import { seedBudgets } from "./budget-seeds.js";
import { seedTransactions } from "./transaction-seeds.js";
import { seedCategories } from "./category-seeds.js";
import { seedUsers } from "./user-seeds.js";
import sequelize from "../config/connection.js";

const seedAll = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("📅 Database synced");

    await seedUsers();
    console.log("🌱 Users seeded");

    await seedAccounts();
    console.log("🌱 Accounts seeded");

    await seedCategories();
    console.log("🌱 categories seeded");
    
    await seedBudgets();
    console.log("🌱 Budgets seeded");

    await seedTransactions();
    console.log("🌱 Transactions seeded");
    process.exit(0);
  } catch (error) {
    console.error("💔 error seeding database", error);
    process.exit(1);
  }
};

seedAll();
