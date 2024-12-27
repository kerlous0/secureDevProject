import axios from "axios";

export const registerUser = async (userData) => {
  const { username, email, password } = userData;
  try {
    const response = await axios.post("http://localhost:3000/user/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
  }
};
