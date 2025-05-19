// navbar.js - Common navigation functionality
document.addEventListener("DOMContentLoaded", function() {
    // Check if navbar exists on the page
    const navbarUser = document.getElementById("navbarUser");
    if (!navbarUser) return;
    
    // Display user info in navbar
    const username = localStorage.getItem('username') || 'User';
    const userInitial = username.charAt(0).toUpperCase();
    
    const userInfoHTML = `
        <div class="user-info">
            <div class="user-avatar">${userInitial}</div>
            <span class="username">${username}</span>
        </div>
        <button id="logoutButton" class="logout-btn">Logout</button>
    `;
    
    navbarUser.innerHTML = userInfoHTML;
    
    // Add logout event handler
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.onclick = function() {
            // Show confirmation dialog
            if (confirm("Apakah Anda yakin ingin keluar?")) {
                console.log("Logout confirmed");
                // Perform logout
                try {
                    fetch("http://localhost:5000/logout", {
                        method: 'DELETE',
                        credentials: 'include'
                    }).finally(() => {
                        // Clear local storage regardless of server response
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        
                        // Redirect to login page
                        window.location.href = 'login/index.html';
                    });
                } catch (error) {
                    console.error('Error during logout:', error);
                    // Still redirect to login page even if there's an error
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.href = 'login/index.html';
                }
            } else {
                console.log("Logout cancelled");
            }
            return false; // Prevent default
        };
    }
});
