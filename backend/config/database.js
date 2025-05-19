import { Sequelize } from "sequelize";

const db = new Sequelize("notes", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
