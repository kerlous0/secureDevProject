import axios from "axios";

export const verifyOTP = async (token, otp) => {
  console.log(otp, token);

  try {
    const response = await axios.post(
      "http://localhost:3000/user/verify-otp",
      {
        otp,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
  }
};
