import axios from "axios";

export const loginUser = async (userData) => {
  try {
    const response = await axios.post("http://localhost:3000/user/login", {
      ...userData,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
  }
};
