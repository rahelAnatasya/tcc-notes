import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./user-model.js";

const Note = db.define("notes", {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
});

Note.belongsTo(User)
User.hasMany(Note);

db.sync();

export default Note;
