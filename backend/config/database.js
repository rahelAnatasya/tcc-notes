import { Sequelize } from "sequelize";

const db = new Sequelize("notes", "root", "", {
  host: "34.121.204.198",
  dialect: "mysql",
});

export default db;
