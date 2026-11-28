const Problem = require("../models/problem");
const Submission = require("../models/problemSubmission");
const User = require("../models/user");

const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const submitCode = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found in request" });
    }

    const problemId = req.params.id || req.body.problemId;
    const { code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        message: "Missing required fields: problemId, code, language",
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res
        .status(400)
        .json({ message: `Unsupported language: ${language}` });
    }

    const allTestCases = [
      ...problem.visibleTestCases,
      ...problem.hiddenTestCases,
    ];

    const submittedResult = await Submission.create({
      userId,
      problemId,
      language,
      languageId, // ← add
      code,
      totalTestCases: allTestCases.length,
      statusId: 1, // ← initial "In Queue"
      statusDescription: "In Queue",
    });

    const submissions = allTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const submissionArray = submitResult.submissions || submitResult;
    const resultToken = submissionArray.map((value) => value.token);
    const testResults = await submitToken(resultToken);

    let passedTestCases = 0;
    let memory = 0;
    let runtime = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResults) {
      if (test.status?.id === 3) {
        passedTestCases++;
        runtime += parseFloat(test.time) || 0;
        memory = Math.max(memory, test.memory || 0);

        // here we will update the problemSolved part of the User Schema.
        await User.updateOne(
          { _id: req.user._id, problemSolved: { $ne: problemId } },
          { $push: { problemSolved: problemId } },
        );
      } else {
        if (test.status?.id === 4) {
          status = "wrong";
        } else {
          status = "error";
        }
        if (!errorMessage) {
          errorMessage =
            test.stderr ||
            test.compile_output ||
            test.status?.description ||
            "Unknown error";
        }
      }
    }

    submittedResult.status = status;
    submittedResult.passedTestCases = passedTestCases;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    submittedResult.errorMessage = errorMessage;

    await submittedResult.save();

    return res.status(200).json({
      message: "Submission judged successfully",
      submissionId: submittedResult._id,
      status,
      passedTestCases,
      totalTestCases: allTestCases.length,
      runtime,
      memory,
      errorMessage,
    });

    // inserting the problem id inside the problemSolved schema of the user.
  } catch (error) {
    return res.status(500).json({
      message: `Error while submitting the problem: ${error.message}`,
    });
  }
};

// run function is same as submit the problem but we don't have to store the data inside the database that's why we have to improve that function.
const runCode = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found in request" });
    }

    const problemId = req.params.id || req.body.problemId;
    const { code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        message: "Missing required fields: problemId, code, language",
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res
        .status(400)
        .json({ message: `Unsupported language: ${language}` });
    }

    const allTestCases = [...problem.visibleTestCases];

    const submissions = allTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const submissionArray = submitResult.submissions || submitResult;
    const resultToken = submissionArray.map((value) => value.token);
    const testResults = await submitToken(resultToken);

    return res.status(200).json(testResults);
  } catch (error) {
    return res.status(500).json({
      message: `Error while submitting the problem: ${error.message}`,
    });
  }
};

module.exports = { submitCode, runCode };
