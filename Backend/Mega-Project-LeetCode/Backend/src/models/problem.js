const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      enum: [
        "array",
        "string",
        "linkedList",
        "stack",
        "queue",
        "tree",
        "graph",
        "dp",
        "recursion",
        "sorting",
        "searching",
        "math",
      ],
      required: true,
    },
    visibleTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
        },
      },
    ],
    hiddenTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
      },
    ],
    starterCode: [
      {
        language: {
          type: String,
          required: true,
        },
        initialCode: {
          type: String,
          required: true,
        },
      },
    ],

    referanceSolution: [
      {
        language: {
          type: String,
          required: true,
        },
        completeCode: {
          type: String,
          required: true,
        },
      },
    ],

    code: [
      {
        language: {
          type: String,
          required: true,
        },
        completeCode: {
          type: String,
          required: true,
        },
      },
    ],
    problemsCreator: {
      // to know the information of those who created the problem
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const Problem = mongoose.model("problem", problemSchema);

module.exports = Problem;
