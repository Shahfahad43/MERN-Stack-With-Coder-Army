const getLanguageById = (lang) => {
  const language = {
    "c++": 105,
    java: 91,
    javascript: 102,
  };

  return language[lang];
};

const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      "https://api.onlinecompiler.io/api/judge0/submissions/batch",
      submissions,
      {
        headers: {
          Authorization: process.env.JUDGE0_API,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Batch Submission Error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

module.exports = { getLanguageById, submitBatch };
