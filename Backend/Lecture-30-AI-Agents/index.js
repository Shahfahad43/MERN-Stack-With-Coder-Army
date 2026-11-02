const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const readlineSync = require("readline-sync");

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chatHistory = [];

// Getting weather
async function getWeather(location) {
  const weatherInfo = [];
  for (const { city, date } of location) {
    if (date.toLowerCase() == "today") {
      const response = await fetch(process.env.WEATHER_API + `${city}`);
      const data = await response.json();
      weatherInfo.push(data);
    } else {
      const response = await fetch(
        process.env.WEATHER_API + `${city}` + `&d${date}`,
      );
      const data = await response.json();
      weatherInfo.push(data);
    }
  }
  return weatherInfo;
}

async function chatWithAgent() {
  const userQuestion = readlineSync.question("How can I help you? ");

  // Giving Prompt to LLM
  const prompt = `You are a precise dual-mode AI agent. Based on the user input and current state, you must output strictly in one of the two JSON formats specified below. No markdown blocks (like \`\`\`json), no explanations, and no conversational text.

Current Year: 2026

### Mode 1: Initial User Weather Request (Extraction)
If the user is asking for the weather and weather details are not yet provided, extract the city/region and date, and return this exact JSON:
{
  "weather_details_needed": true,
  "location": [
    {"city": "CityName", "date": "YYYY-MM-DD or today"}
  ]
}

### Mode 2: Final Response (Weather Report)
If you already have the weather details and need to generate the final response, return this JSON:
{
  "weather_details_needed": false,
  "weather_report": "Your custom weather description and advice here"
}

### Examples:
User: "I want to know the weather about London."
Output: {
  "weather_details_needed": true,
  "location": [
    {"city": "London", "date": "today"}
  ]
}

User: "I want to know about the weather of London on 20th November and Islamabad on 2nd November."
Output: {
  "weather_details_needed": true,
  "location": [
    {"city": "London", "date": "2026-11-20"},
    {"city": "Islamabad", "date": "2026-11-02"}
  ]
}

userInput = ${userQuestion}

Strictly follow the given instructions.`;

  chatHistory.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  while (true) {
    // our LLM
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatHistory,
    });

    // console.log("\nModel Response:");
    // console.log(response.text);

    const answer = response.text;

    // Keeping the history
    chatHistory.push({
      role: "model",
      parts: [{ text: answer }],
    });

    const data = JSON.parse(answer);
    console.log(data);

    if (data.weather_details_needed === false) {
      console.log(data.weather_report);
      break;
    }

    const weather = await getWeather(data.location);
    const weatherInString = JSON.stringify(weather);
    chatHistory.push({
      role: "user",
      parts: [
        {
          text: `Here is the weather details for the requested cities: ${weatherInString}`,
        },
      ],
    });
    console.log(weather);
  }
}

chatWithAgent();
// it will give something like this
// {
//   "weather_details_needed": true,
//   "location": [
//     {"city": "Islamabad", "date": "today"}
//   ]
// }
