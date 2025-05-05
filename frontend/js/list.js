// Don't use document.write for loading dependencies
// Instead, include the script in the HTML file

// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const notesList = document.getElementById("notesList");
  const addNoteButton = document.getElementById("addNoteButton");

  // Load notes when page loads
  fetchNotes();

  // Event Listeners
  addNoteButton.addEventListener("click", () => {
    window.location.href = "add.html";
  });

  // Fetch all notes from API
  async function fetchNotes() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const notes = await response.json();
      renderNotes(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showMessage("Failed to load notes. Please try again later.", "error");
    }
  }

  // Render notes to the DOM
  function renderNotes(notes) {
    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML =
        '<p class="no-notes">No notes found. Create your first note!</p>';
      return;
    }

    notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note-card");

      // Format date for display
      let updatedDate = "";
      if (note.updatedAt) {
        const date = new Date(note.updatedAt);
        updatedDate = date.toLocaleString();
      }

      noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content.substring(0, 100)}${
        note.content.length > 100 ? "..." : ""
      }</p>
                <div class="note-meta">Updated: ${updatedDate}</div>
                <div class="note-actions">
                    <button class="view-btn" data-id="${note.id}">View</button>
                    <button class="edit-btn" data-id="${note.id}">Edit</button>
                    <button class="delete-btn" data-id="${
                      note.id
                    }">Delete</button>
                </div>
            `;

      // Add event listeners to buttons
      const viewBtn = noteElement.querySelector(".view-btn");
      const editBtn = noteElement.querySelector(".edit-btn");
      const deleteBtn = noteElement.querySelector(".delete-btn");

      viewBtn.addEventListener("click", () => {
        window.location.href = `view.html?id=${note.id}`;
      });

      editBtn.addEventListener("click", () => {
        window.location.href = `edit.html?id=${note.id}`;
      });

      deleteBtn.addEventListener("click", () => deleteNote(note.id));

      notesList.appendChild(noteElement);
    });
  }

  // Delete note
  async function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      showMessage("Note deleted successfully!", "success");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      showMessage("Failed to delete note. Please try again.", "error");
    }
  }
});
