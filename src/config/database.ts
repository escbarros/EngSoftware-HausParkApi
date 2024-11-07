import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const dbPath = path.resolve(__dirname, "../../", "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.NODE_ENV == "test" ? ":memory:" : dbPath,
  logging: false,
});

export default sequelize;
