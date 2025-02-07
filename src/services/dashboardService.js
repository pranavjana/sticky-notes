const API_URL = 'http://localhost:3001/api';

export const getDashboardSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
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
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
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