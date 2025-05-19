// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = "login/index.html";
        return;
    }
    
    const noteIdInput = document.getElementById('noteId');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const updateButton = document.getElementById('updateButton');
    const cancelButton = document.getElementById('cancelButton');

    // Get the note ID from URL
    const noteId = getUrlParam('id');

    if (!noteId) {
        showMessage('ID Catatan tidak tersedia', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    fetchNote(noteId);

    // Event Listeners
    updateButton.addEventListener('click', () => updateNote());
    cancelButton.addEventListener('click', () => {
        if (confirm('Anda yakin ingin membuang perubahan?')) {
            window.location.href = `view.html?id=${noteId}`;
        }
    });

    // Update note
    async function updateNote() {
        const id = noteIdInput.value;
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title || !content) {
            showMessage('Mohon isi judul dan konten', 'error');
            return;
        }
        
        try {
            const response = await apiRequest(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
            
            if (!response) {
                return;
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal memperbarui catatan');
            }
            
            const responseData = await response.json();
            showMessage(responseData.message || 'Catatan berhasil diperbarui', 'success');
            
            // Redirect to view the updated note after a short delay
            setTimeout(() => {
                window.location.href = `view.html?id=${id}`;
            }, 1000);
        } catch (error) {
            console.error('Error updating note:', error);
            showMessage('Gagal memperbarui catatan: ' + (error.message || 'Silakan coba lagi.'), 'error');
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
            throw new Error(errorData.message || 'Catatan tidak ditemukan');
        }
        
        const responseData = await response.json();
        const note = responseData.data;
        
        // Populate form with note data
        document.getElementById('noteId').value = note.id;
        document.getElementById('title').value = note.title;
        document.getElementById('content').value = note.content;
        
    } catch (error) {
        console.error('Error fetching note:', error);
        showMessage('Gagal memuat catatan: ' + (error.message || 'Catatan tidak ditemukan atau telah dihapus.'), 'error');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}
