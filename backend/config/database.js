import { Sequelize } from "sequelize";

const db = new Sequelize("notes", "root", "", {
  host: "34.57.106.82",
  dialect: "mysql",
});

export default db;
