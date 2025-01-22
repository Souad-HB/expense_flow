import { User } from "../models/index.js";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  await User.bulkCreate([
    {
      firstName: "Souad",
      lastName: "Hassen",
      email: "souadhassen@gmail.com",
      password: await bcrypt.hash("password", 10),
      isAdmin: false,
    },
    {
      firstName: "Hayden",
      lastName: "Hassen",
      email: "haydenhassen@gmail.com",
      password: await bcrypt.hash("password", 10),
      isAdmin: false,
    },
    {
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@gmail.com",
      password: await bcrypt.hash("password", 10),
      isAdmin: true,
    },
  ]);
};
