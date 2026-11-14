import axios from "axios";
const url = "http://localhost:8000";
const addUser = async (data) => {
  try {
    await axios.post(url, data);
  } catch (error) {
    console.log("Error :" + error.message);
  }
};

export default addUser;
