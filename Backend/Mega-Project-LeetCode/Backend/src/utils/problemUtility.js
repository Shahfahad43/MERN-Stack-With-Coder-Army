const axios = require("axios");

const JUDGE0_COMPAT_BASE = "https://api.onlinecompiler.io/api/judge0";

const getLanguageById = (lang) => {
  const language = {
    "c++": 105,
    java: 91,
    javascript: 102,
    python: 113,
  };

  return language[lang];
};

const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      `${JUDGE0_COMPAT_BASE}/submissions/batch`,
      { submissions },
      {
        headers: {
          "X-Auth-Token": process.env.JUDGE0_API,
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

const submitToken = async (
  resultToken,
  maxWaitMs = 30000,
  intervalMs = 500,
) => {
  const tokenStr = Array.isArray(resultToken)
    ? resultToken.join(",")
    : resultToken;

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const response = await axios.get(
      `${JUDGE0_COMPAT_BASE}/submissions/batch`,
      {
        params: {
          tokens: tokenStr,
          fields: "token,status,stdout,stderr,compile_output,time,memory",
        },
        headers: {
          "X-Auth-Token": process.env.JUDGE0_API,
        },
      },
    );

    const submissions = response.data.submissions;

    const allFinished = submissions.every(
      (s) => s.status && s.status.id !== 1 && s.status.id !== 2,
    );

    if (allFinished) {
      return submissions;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    "Judge0 polling timed out: submissions still in queue/processing",
  );
};

module.exports = { getLanguageById, submitBatch, submitToken };

// go to the official website of judge 0 and get the submission token format -> https://ce.judge0.com/#submissions-submission-batch
// complete creating this creating the problem in the given format and store some of them in the database.
// read the documents before buidling this functionality
// focus on the understanding, not on the context and understand the workflow.
