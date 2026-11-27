const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const Problem = require("../models/problem");

// create a new problem
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

// update existing problem
const updateProblem = async (req, res) => {
  const { id } = req.params;

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

    if (!id) return res.send("Missing Id!");

    const existinProblem = await Problem.findById(id);
    if (!existinProblem) return res.send("The current problem doesn't exist.");
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true },
    );
    return res.status(200).json("Problem updated successfuly!", updatedProblem);
  } catch (error) {
    return res
      .status(500)
      .json("Error while updating problem: ", error.message);
  }
};

// delete an existing user

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.send("Missing id!");
    const existProblem = await Problem.findById(id);
    if (!existProblem) return res.send("Problem doesn't exist!");
    const deleteProblem = await Problem.findByIdAndDelete(id);
    return res.status(200).json("Problem deleted successfuly!", deleteProblem);
  } catch (error) {
    return res
      .status(500)
      .json("Error while deleting problem: ", error.message);
  }
};

// get a problem by id
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.send("Missing id!");
    // but we can't send all the information to the user -> the things can be exposed which normally shouldn't be so that's why we user "select"
    const existProblem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases starterCode referanceSolution",
    );
    if (!existProblem) return res.send("Problem doesn't exist!");
    return res.status(200).json(existProblem);
  } catch (error) {
    return res
      .status(500)
      .json("Error while getting problem by id: ", error.message);
  }
};

// get all problems
const fetchAllProlbmes = async (req, res) => {
  try {
    const allProblems = await Problem.find({});
    if (allProblems.length == 0) return res.send("Problems are missing!");

    // but here is a problem -> Getting all the problems at a time and then sending it. -> we can't get the problems using "pagination". -> on the page 10 problems and then on another page another ten and just like that.

    // just like that I can find different problems based on their difficulty level.

    return res.status(200).json(allProblems);
  } catch (error) {
    return res
      .status(500)
      .json("Error while getting problem by id: ", error.message);
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  fetchAllProlbmes,
};
