// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = "login/index.html";
    return;
  }
  
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const noteDate = document.getElementById("noteDate");
  const editButton = document.getElementById("editButton");
  const deleteButton = document.getElementById("deleteButton");
  const backButton = document.getElementById("backButton");

  // Ensure all elements exist
  if (!noteTitle || !noteContent || !editButton || !deleteButton || !backButton) {
    console.error("Required elements not found on page");
    return;
  }

  // Get note ID from URL
  const noteId = getUrlParam("id");

  if (!noteId) {
    showMessage("ID Catatan tidak tersedia", "error");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    return;
  }

  fetchNote(noteId);

  // Event Listeners
  editButton.addEventListener("click", () => {
    window.location.href = `edit.html?id=${noteId}`;
  });

  deleteButton.addEventListener("click", () => deleteNote(noteId));

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

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
      showMessage(responseData.message || "Catatan berhasil dihapus!", "success");

      // Redirect to notes list after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      console.error("Error deleting note:", error);
      showMessage("Gagal menghapus catatan: " + (error.message || "Silakan coba lagi."), "error");
    }
  }
});

// Fetch note details
async function fetchNote(id) {
  try {
    const response = await apiRequest(`${API_URL}/${id}`);
    
    if (!response) {
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Catatan tidak ditemukan");
    }

    const responseData = await response.json();
    const note = responseData.data;

    // Update the UI with note data
    document.getElementById("noteTitle").textContent = note.title;

    // Format content with paragraphs
    const noteContent = document.getElementById("noteContent");
    noteContent.innerHTML = note.content
      .split("\n")
      .filter((para) => para.trim() !== "")
      .map((para) => `<p>${para}</p>`)
      .join("");

    // Format date
    const noteDate = document.getElementById("noteDate");
    if (note.updatedAt) {
      const date = new Date(note.updatedAt);
      noteDate.textContent = `Terakhir diperbarui: ${date.toLocaleString()}`;
    }
  } catch (error) {
    console.error("Error fetching note:", error);
    showMessage("Gagal memuat catatan: " + (error.message || "Catatan tidak ditemukan atau telah dihapus."), "error");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}
