// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const notesList = document.getElementById("notesList");
  const addNoteButton = document.getElementById("addNoteButton");
  
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = "login/index.html";
    return;
  }
  
  // Load notes when page loads
  fetchNotes();

  // Event Listeners
  addNoteButton.addEventListener("click", () => {
    window.location.href = "add.html";
  });

  // Fetch all notes from API
  async function fetchNotes() {
    try {
      const response = await apiRequest(API_URL);
      
      if (!response) {
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil catatan");
      }
      
      const responseData = await response.json();
      
      if (responseData.status === "Sukses") {
        renderNotes(responseData.data);
      } else {
        showMessage(responseData.message || "Gagal memuat catatan", "error");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      showMessage("Gagal memuat catatan: " + (error.message || "Silakan coba lagi nanti."), "error");
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
    if (!confirm("Anda yakin ingin menghapus catatan ini?")) {
      return;
    }

    try {
      const response = await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      
      if (!response) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus catatan");
      }
      
      const responseData = await response.json();
      showMessage(responseData.message || "Catatan berhasil dihapus", "success");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      showMessage("Gagal menghapus catatan: " + (error.message || "Silakan coba lagi."), "error");
    }
  }
});
