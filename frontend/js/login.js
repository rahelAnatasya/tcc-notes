// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Clear any previous error messages
        clearMessages();
        
        // Validate inputs
        if (!username || !password) {
            showMessage('Username dan password harus diisi', 'error');
            return;
        }
        
        // Attempt login
        const result = await login(username, password);
        
        if (result.success) {
            showMessage('Login berhasil. Mengalihkan...', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    });
});

// Show message function
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Clear all messages
function clearMessages() {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.style.display = 'none';
        messageEl.textContent = '';
    }
}