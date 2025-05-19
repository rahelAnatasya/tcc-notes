import Note from "../models/note-model.js";

export async function getNotes(req, res) {
  try {
    const userId = req.userId;
    
    const notes = await Note.findAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });
    
    return res.status(200).json({
      status: "Sukses",
      message: "Data catatan berhasil diambil",
      data: notes
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
}

export async function getNoteById(req, res) {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    
    const note = await Note.findOne({
      where: {
        id: noteId,
        userId
      }
    });
    
    if (!note) {
      return res.status(404).json({
        status: "Error",
        message: "Catatan tidak ditemukan"
      });
    }
    
    return res.status(200).json({
      status: "Sukses",
      message: "Data catatan berhasil diambil",
      data: note
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    
    if (!title || !content) {
      return res.status(400).json({
        status: "Error",
        message: "Judul dan isi catatan harus diisi"
      });
    }
    
    const newNote = await Note.create({
      title,
      content,
      userId
    });
    
    return res.status(201).json({
      status: "Sukses",
      message: "Catatan berhasil dibuat",
      data: newNote
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const noteId = req.params.id;
    
    const note = await Note.findOne({
      where: {
        id: noteId,
        userId
      }
    });
    
    if (!note) {
      return res.status(404).json({
        status: "Error",
        message: "Catatan tidak ditemukan"
      });
    }
    
    await note.update({
      title: title || note.title,
      content: content || note.content
    });
    
    return res.status(200).json({
      status: "Sukses",
      message: "Catatan berhasil diperbarui",
      data: note
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
}

export async function deleteNote(req, res) {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    
    const note = await Note.findOne({
      where: {
        id: noteId,
        userId
      }
    });
    
    if (!note) {
      return res.status(404).json({
        status: "Error",
        message: "Catatan tidak ditemukan"
      });
    }
    
    await note.destroy();
    
    return res.status(200).json({
      status: "Sukses",
      message: "Catatan berhasil dihapus"
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
}
