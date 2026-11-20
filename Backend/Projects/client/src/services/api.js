import axios from "axios";

const url = "http://localhost:8000";

export const addUser = async (data) => {
  try {
    const response = await axios.post(`${url}/add`, data);
    return response.data;
  } catch (error) {
    console.error("addUser error:", error.message);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${url}/users`);
    return response.data;
  } catch (error) {
    console.error("getUsers error:", error.message);
    throw error;
  }
};

export const setConversation = async (data) => {
  try {
    const response = await axios.post(`${url}/conversation/add`, data);
    console.log("Conversation response:", response.data); // Ab console mein dikhega
    return response.data;
  } catch (error) {
    console.error("setConversation error:", error.message);
    throw error;
  }
};
