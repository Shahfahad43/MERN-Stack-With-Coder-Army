const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.onlinecompiler.io/api/run-code-sync/",
  headers: {
    Authorization: ee940337d1f79dc6f363bdfc10b928b6,
    "Content-Type": "application/json",
  },
  data: {
    compiler: "python-3.14",
    code: "print('Hello World')",
    input: "",
  },
};

async function runCode() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

runCode();

// batch submissionm

const axios = require("axios");

const submitBatch = async (submissions) => {
  try {
    const response = await axios.post("YOUR_BATCH_API_ENDPOINT", submissions, {
      headers: {
        Authorization: "YOUR_API_KEY",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Batch Submission Error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

module.exports = submitBatch;
