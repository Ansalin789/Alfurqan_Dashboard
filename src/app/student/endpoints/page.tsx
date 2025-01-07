import axios from 'axios';

const API_URL = 'http://localhost:5001';

// signIn function
export const signIn = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, { username, password });

    // Handle successful login response
    if (response.status === 200) {
      return response.data;
    }

    throw new Error('Unexpected error occurred');
  } catch (error: any) {
    // Handle backend errors, e.g., user not found
    if (error.response && error.response.status === 404) {
      throw new Error('Email not found'); // Specific error message
    }

    // Handle other errors
    throw new Error(error.message || 'Login failed');
  }
};

