import axios from 'axios';

const API_URL = 'http://localhost:5001';

// signIn function
export const signIn = async (username: string, password: string) => {
  try {
    const response = await axios.post(`http://localhost:5001/signin`, { username, password });

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
export const checkEmail = async (email: string) => {
  try {
    // Send a POST request to the backend to check if the email exists
    const response = await axios.post(`http://localhost:5001/allcheck-email`, { email});

    // If the response status is 200, the email exists
    if (response.status === 200) {
      console.log('Email exists:', response.data);
      return { message: 'Email exists', data: response.data }; // Return email data
    }
  } catch (error: any) {
    // Handle errors based on status code if available
    if (error.response) {
      if (error.response.status === 404) {
        console.log('Email not found');
        return { message: 'Email not found' }; // Email not found
      }
      
      if (error.response.status === 500) {
        console.log('Internal Server Error');
        return { message: 'Internal Server Error' }; // Handle server errors
      }
    }
    
    // Handle non-HTTP errors or unexpected issues (network error, etc.)
    console.log('Error occurred:', error.message || 'Unknown error');
    return { message: 'Unknown error occurred' }; // Return unknown error message
  }
};

