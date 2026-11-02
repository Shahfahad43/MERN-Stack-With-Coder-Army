// require("dotenv").config();

// async function getWeather(city) {
//   const res = await fetch(process.env.WEATHER_API + `${city}`);
//   const data = await res.json();
//   console.log(data);
// }

// getWeather("Mardan");

// const readlineSync = require("readline-sync");
// const userQuestion = readlineSync.question("How can I help you?");

// const { GoogleGenAI } = require("@google/genai");
// const dotenv = require("dotenv");
// dotenv.config();

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// const chatHistory = [];
// chatHistory.push({
//   role: "user",
//   parts: [{ text: userQuestion }],
// });

// async function main() {
//   const response = await ai.interactions.create({
//     model: "gemini-3.5-flash",
//     input: chatHistory,
//   });
//   console.log(response.output_text);
// }

// main();

// const readlineSync = require("readline-sync");
// const userQuestion = readlineSync.question("How can I help you? ");

// const { GoogleGenAI } = require("@google/genai");
// const dotenv = require("dotenv");
// dotenv.config();

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// const chatHistory = [];
// chatHistory.push({
//   role: "user",
//   parts: [{ text: userQuestion }],
// });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.5-flash", // Yahan model name update kar diya hai
//     contents: chatHistory,
//   });
//   console.log(response.text);
// }

// main();
