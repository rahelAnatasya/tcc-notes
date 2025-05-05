// Don't use document.write for loading dependencies
// Instead, include the script in the HTML file

// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const noteDate = document.getElementById("noteDate");
  const editButton = document.getElementById("editButton");
  const deleteButton = document.getElementById("deleteButton");
  const backButton = document.getElementById("backButton");

  // Get note ID from URL
  const noteId = getUrlParam("id");

  if (!noteId) {
    showMessage("Note ID not provided", "error");
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

      // Redirect to notes list after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      console.error("Error deleting note:", error);
      showMessage("Failed to delete note. Please try again.", "error");
    }
  }
});

// Fetch note details
async function fetchNote(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Note not found");
    }

    const note = await response.json();

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
    if (note.updateAt) {
      const date = new Date(note.updatedAt);
      noteDate.textContent = `Last updated: ${date.toLocaleString()}`;
    }
  } catch (error) {
    console.error("Error fetching note:", error);
    showMessage("Failed to load note. Redirecting to notes list...", "error");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}
