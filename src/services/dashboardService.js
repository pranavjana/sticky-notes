const API_URL = import.meta.env.VITE_API_URL;

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

export const getDashboardSettings = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard settings:', error);
    throw error;
  }
};

export const updateDashboardTitle = async (title) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ title })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update dashboard title');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating dashboard title:', error);
    throw error;
  }
}; 