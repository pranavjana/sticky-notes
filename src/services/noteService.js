const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = async () => {
  try {
    const token = await window.Clerk?.session?.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw new Error('Authentication failed');
  }
};

export const getNotes = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notes`, {
      headers,
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch notes');
    }
    return response.json();
  } catch (error) {
    console.error('Error in getNotes:', error);
    throw error;
  }
};

export const createNote = async (noteData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create note');
    }
    return response.json();
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Server error response:', error);
      throw new Error(error.message || 'Failed to update note');
    }

    const updatedNote = await response.json();
    if (!updatedNote) {
      console.error('No response data from server');
      throw new Error('No response data from server');
    }

    return updatedNote;
  } catch (error) {
    console.error('Error in updateNote:', error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete note');
    }
    return response.json();
  } catch (error) {
    console.error('Error in deleteNote:', error);
    throw error;
  }
};

export const batchUpdateNotes = async (updates) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notes/batch-update`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ updates }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update notes');
    }
    return response.json();
  } catch (error) {
    console.error('Error in batchUpdateNotes:', error);
    throw error;
  }
}; 