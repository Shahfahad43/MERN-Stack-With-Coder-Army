const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    // ─────────────── WHO + WHAT ───────────────
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true, // frequent query: "all submissions by user X"
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
      index: true, // frequent query: "all submissions for problem Y"
    },

    // ─────────────── CODE ───────────────
    language: {
      type: String,
      required: true, // e.g. "c++", "python"
      trim: true,
    },
    languageId: {
      type: Number,
      required: true, // e.g. 105 for C++ — snapshot at submission time
    },
    code: {
      type: String,
      required: true,
      maxlength: 100000, // ~100KB cap — prevents abuse
    },

    // ─────────────── VERDICT ───────────────
    statusId: {
      type: Number,
      // required: true, // Judge0 status: 3=Accepted, 4=WA, 5=TLE, 6=CE...
    },
    statusDescription: {
      type: String,
      // required: true, // "Accepted" / "Wrong Answer" / ...
    },

    // ─────────────── OUTPUT ───────────────
    stdout: { type: String, default: null },
    stderr: { type: String, default: null },
    compileOutput: { type: String, default: null },

    // ─────────────── RESOURCE USAGE ───────────────
    executionTime: { type: Number, default: null }, // seconds (Judge0 convention)
    memory: { type: Number, default: null }, // KB

    // ─────────────── TEST CASE DETAIL ───────────────
    totalTestCases: { type: Number, default: 0 },
    passedTestCases: { type: Number, default: 0 },
    failedTestCaseIndex: { type: Number, default: null }, // 0-based, or null if all passed
    // NOTE: never store the hidden test case's stdin/expected_output here —
    //       it would leak via API responses.

    // ─────────────── JUDGE METADATA ───────────────
    tokens: {
      type: [String],
      default: [], // Judge0 tokens for the batch — for debugging/audit
    },
    judgedAt: {
      type: Date,
      default: null, // when the verdict was finalized
    },
  },
  { timestamps: true },
);

const Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;
