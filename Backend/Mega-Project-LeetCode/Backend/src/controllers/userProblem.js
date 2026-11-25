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
    }
  } catch (error) {
    return res
      .status(500)
      .json("Error while calling creatProlbme! ", error.message);
  }
};

module.exports = { createProblem };
