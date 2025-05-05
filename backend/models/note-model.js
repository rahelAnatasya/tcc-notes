import { Sequelize } from "sequelize";
import db from "../config/database.js";

// Tabel note
const Note = db.define("notes", {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
});

db.sync();

export default Note;
