import sequelize from "./config/connection.ts";
import express from "express";
import path from "path";

const forceDatabaseRefresh = false;

const app = express();
const PORT = process.env.PORT || 3001;

// serve static files before routes and middleware
const buildPath = path.join(__dirname, "../..", "client", "dist");
app.use(express.static(buildPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  await sequelize.authenticate();
  console.log("🟢 Connected to the expenses_db");
  app.listen(PORT, () => {
    console.log("🎉 Server is listening on port 3001");
  });
} catch (error) {
  console.error("🔴 Unable to connect to the database:", error);
}
