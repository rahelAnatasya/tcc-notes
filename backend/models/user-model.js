import { Sequelize } from "sequelize";
import db from "../config/database.js";

const User = db.define("user", {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  refresh_token: {
    type: Sequelize.TEXT,
    allowNull: true
  },
});

// Force sync to update the table schema
db.sync({ alter: true });

export default User;
