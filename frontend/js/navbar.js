// navbar.js - Common navigation functionality
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        window.location.href = 'login/index.html';
        return;
    }

    // Check if navbar exists on the page
    const navbarUser = document.getElementById("navbarUser");
    if (!navbarUser) return;
    
    // Display user info in navbar
    const username = getUsername() || 'User';
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
        logoutButton.onclick = async function() {
            await logout();
        };
    }
});
