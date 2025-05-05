// Don't use document.write for loading dependencies
// Instead, include the script in the HTML file

// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");

  // Event Listeners
  saveButton.addEventListener("click", saveNote);
  cancelButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to discard this note?")) {
      window.location.href = "index.html";
    }
  });

  // Save new note
  async function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      showMessage("Please fill in both title and content", "error");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const newNote = await response.json();
      showMessage("Note created successfully!", "success");

      // Redirect to view the new note after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      console.error("Error saving note:", error);
      showMessage("Failed to save note. Please try again.", "error");
    }
  }
});
