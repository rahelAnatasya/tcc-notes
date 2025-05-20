// API base URL - update this to match your backend URL
const BASE_URL = "https://tcc-notes-backend-469569820136.us-central1.run.app";

const API_URL = `${BASE_URL}/notes`;
const AUTH_URL = BASE_URL;

// Get auth token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Get username from localStorage
function getUsername() {
  return localStorage.getItem("username");
}

// Check if user is authenticated
function isAuthenticated() {
  return getToken() !== null;
}

// Login user
async function login(username, password) {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("username", username);
      return { success: true, message: "Login berhasil" };
    } else {
      return { success: false, message: data.message || "Login gagal" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Terjadi kesalahan pada server" };
  }
}

// Register user
async function register(username, password) {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "Registrasi berhasil" };
    } else {
      return { success: false, message: data.message || "Registrasi gagal" };
    }
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, message: "Terjadi kesalahan pada server" };
  }
}

// Handle token refresh
async function refreshToken() {
  try {
    const response = await fetch(`${AUTH_URL}/token`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

// Logout user
async function logout() {
  // Show confirmation dialog
  if (!confirm("Apakah Anda yakin ingin keluar?")) {
    return; // User cancelled logout
  }

  try {
    await fetch(`${AUTH_URL}/logout`, {
      method: "DELETE",
      credentials: "include",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login/index.html";
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

// API request with token refresh capability
async function apiRequest(url, options = {}) {
  const token = getToken();

  if (!token) {
    window.location.href = "login/index.html";
    return null;
  }

  // Set auth header if not already set
  if (!options.headers) {
    options.headers = {};
  }

  options.headers["Authorization"] = `Bearer ${token}`;

  try {
    let response = await fetch(url, options);

    // If unauthorized, try to refresh token
    if (response.status === 401 || response.status === 403) {
      const refreshed = await refreshToken();

      if (refreshed) {
        // Retry with new token
        options.headers["Authorization"] = `Bearer ${getToken()}`;
        response = await fetch(url, options);
      } else {
        // Redirect to login if refresh failed
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        showMessage("Sesi telah berakhir. Silakan login kembali.", "error");
        setTimeout(() => {
          window.location.href = "login/index.html";
        }, 2000);
        return null;
      }
    }

    // If response is not ok, try to get error message from response
    if (!response.ok) {
      try {
        const errorData = await response.json();
        if (errorData.message) {
          showMessage(errorData.message, "error");
        } else {
          showMessage(
            `Error: ${response.status} - ${response.statusText}`,
            "error"
          );
        }
      } catch {
        showMessage(
          `Error: ${response.status} - ${response.statusText}`,
          "error"
        );
      }
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);
    showMessage("Terjadi kesalahan saat menghubungi server", "error");
    return null;
  }
}

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
