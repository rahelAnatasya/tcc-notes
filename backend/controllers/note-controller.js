import Note from "../models/note-model.js";

// GET all notes
export async function getNotes(req, res) {
  try {
    const notes = await Note.findAll({
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET note by ID
export async function getNoteById(req, res) {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// CREATE note
export async function createNote(req, res) {
  try {
    const input = req.body;
    if (!input || !input.title || !input.content) {
      return res.status(400).json({ message: "Invalid input" });
    }
    await Note.create(input);
    res.status(201).json({ message: "Note created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// UPDATE note
export async function updateNote(req, res) {
  try {
    const input = req.body;
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await note.update(input);
    res.status(200).json({ message: "Note updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE note
export async function deleteNote(req, res) {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await note.destroy();
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
