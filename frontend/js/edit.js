// Don't use document.write for loading dependencies
// Instead, include the script in the HTML file

// DOM Elements - Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const noteIdInput = document.getElementById('noteId');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const updateButton = document.getElementById('updateButton');
    const cancelButton = document.getElementById('cancelButton');

    // Get the note ID from URL
    const noteId = getUrlParam('id');

    if (!noteId) {
        showMessage('Note ID not provided', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    fetchNote(noteId);

    // Event Listeners
    updateButton.addEventListener('click', () => updateNote());
    cancelButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to discard your changes?')) {
            window.location.href = `view.html?id=${noteId}`;
        }
    });

    // Update note
    async function updateNote() {
        const id = noteIdInput.value;
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title || !content) {
            showMessage('Please fill in both title and content', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update note');
            }
            
            showMessage('Note updated successfully!', 'success');
            
            // Redirect to view the updated note after a short delay
            setTimeout(() => {
                window.location.href = `view.html?id=${id}`;
            }, 1000);
        } catch (error) {
            console.error('Error updating note:', error);
            showMessage('Failed to update note. Please try again.', 'error');
        }
    }
});

// Fetch note details
async function fetchNote(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Note not found');
        }
        
        const note = await response.json();
        
        // Populate form with note data
        document.getElementById('noteId').value = note.id;
        document.getElementById('title').value = note.title;
        document.getElementById('content').value = note.content;
        
    } catch (error) {
        console.error('Error fetching note:', error);
        showMessage('Failed to load note. Redirecting to notes list...', 'error');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}
