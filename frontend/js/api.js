// API base URL - update this to match your backend URL
const API_URL = "https://tugas6-be-285761334624.us-central1.run.app/notes";

// Show message function for all pages
function showMessage(text, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;

  document.querySelector(".container").prepend(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Helper function to get URL parameters
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
