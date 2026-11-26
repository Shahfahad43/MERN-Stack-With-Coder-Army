const { getLanguageById, submitBatch } = require("../utils/problemUtility");

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
      code,
      problemsCreator,
    } = req.body;

    for (const { language, completeCode } of referanceSolution) {
      // here we will be using Judge0
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((input, output) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: input, // standard input
        expected_output: output,
      }));

      const submitResponse = submitBatch(submissions);
    }
  } catch (error) {
    return res
      .status(500)
      .json("Error while calling creatProlbme! ", error.message);
  }
};

module.exports = { createProblem };
