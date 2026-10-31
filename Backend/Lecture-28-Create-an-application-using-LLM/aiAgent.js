require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main(msg) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: msg,
  });
  return response.text;
}

module.exports = main;
