// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = "login/index.html";
    return;
  }
  
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");

  // Ensure all elements exist
  if (!titleInput || !contentInput || !saveButton || !cancelButton) {
    console.error("Required elements not found on page");
    return;
  }

  // Event Listeners
  saveButton.addEventListener("click", saveNote);
  cancelButton.addEventListener("click", () => {
    if (confirm("Anda yakin ingin membuang catatan ini?")) {
      window.location.href = "index.html";
    }
  });

  // Save new note
  async function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      showMessage("Mohon isi judul dan konten", "error");
      return;
    }

    try {
      const response = await apiRequest(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include', // Add this to include cookies/credentials
      });
      
      if (!response) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan catatan");
      }

      const responseData = await response.json();
      showMessage(responseData.message || "Catatan berhasil dibuat!", "success");

      // Redirect to view the new note after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      console.error("Error saving note:", error);
      showMessage("Gagal menyimpan catatan: " + (error.message || "Silakan coba lagi."), "error");
    }
  }
});
