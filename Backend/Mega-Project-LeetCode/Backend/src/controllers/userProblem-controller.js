const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const Problem = require("../models/problem");

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referanceSolution,
    } = req.body;

    if (!referanceSolution || referanceSolution.length === 0) {
      return res
        .status(400)
        .json({ message: "Reference solution is required" });
    }

    for (const { language, completeCode } of referanceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Unsupported language: ${language}` });
      }

      const allTestCases = [...visibleTestCases, ...hiddenTestCases];

      const submissions = allTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);

      const submissionArray = submitResult.submissions || submitResult;
      const resultToken = submissionArray.map((value) => value.token);

      const testResults = await submitToken(resultToken);

      for (let i = 0; i < testResults.length; i++) {
        const result = testResults[i];
        if (result.status && result.status.id !== 3) {
          return res.status(400).json({
            message: `Reference solution failed for language "${language}" on test case ${i + 1}`,
            detail: {
              status: result.status,
              stdout: result.stdout,
              stderr: result.stderr,
              compile_output: result.compile_output,
              expected: allTestCases[i].output,
            },
          });
        }

        const actualOutput = (result.stdout || "").trim();
        const expectedOutput = allTestCases[i].output.trim();
        if (actualOutput !== expectedOutput) {
          return res.status(400).json({
            message: `Reference solution output mismatch for language "${language}" on test case ${i + 1}`,
            detail: { actual: actualOutput, expected: expectedOutput },
          });
        }
      }
    }

    const newProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referanceSolution,
      code: req.body.code,
      problemsCreator: req.user._id,
    });

    return res.status(201).json({
      message: "Problem created successfully",
      problemId: newProblem._id,
    });
  } catch (error) {
    console.error("createProblem error:", error);
    return res.status(500).json({
      message: "Error while creating problem",
      error: error.message,
    });
  }
};

module.exports = { createProblem };
