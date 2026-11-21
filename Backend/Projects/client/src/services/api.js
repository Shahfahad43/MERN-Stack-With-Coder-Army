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
    return response.data;
  } catch (error) {
    console.error("setConversation error:", error.message);
    throw error;
  }
};

export const getConversation = async (data) => {
  try {
    const response = await axios.post(`${url}/conversation/get`, data);
    return response.data;
  } catch (error) {
    console.error("getConversation error:", error.message);
    throw error;
  }
};

export const newMessage = async (data) => {
  try {
    const response = await axios.post(`${url}/message/add`, data);
    return response.data;
  } catch (error) {
    console.error("newMessage error:", error.message);
    throw error;
  }
};

export const getMessages = async (id) => {
  try {
    let response = await axios.get(`${url}/message/get/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error while calling getMessages API:", error.message);
  }
};

export const uploadFile = async (data) => {
  try {
    return await axios.post(`${url}/file/upload`, data);
  } catch (error) {
    console.log("Error while calling uploadFile API:", error.message);
  }
};
