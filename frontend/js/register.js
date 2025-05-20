// Handle registration form submission
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        console.error('Register form not found');
        return;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Clear any previous error messages
        clearMessages();
        
        // Validate inputs
        if (!username || !password || !confirmPassword) {
            showMessage('Semua kolom harus diisi', 'error');
            return;
        }
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showMessage('Password tidak cocok', 'error');
            return;
        }
        
        // Attempt registration
        const result = await register(username, password);
        
        if (result.success) {
            showMessage('Registrasi berhasil! Mengalihkan ke halaman login...', 'success');
            setTimeout(() => {
                window.location.href = '../login/index.html';
            }, 2000);
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