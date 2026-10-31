const express = require("express");
const main = require("./aiAgent");
const app = express();
app.use(express.json());

// maintaining the history
const chatHistory = {};
// So I have to have the following details of the user:
// userId -> store everything in the form of key value pair
//

app.post("/chat", async (req, res) => {
  const { id, msg } = req.body;
  // if it is a new user then first create a user history for him
  if (!chatHistory[id]) chatHistory[id] = [];

  // getting the history of the user
  const History = chatHistory[id];

  // giving the promp
  const promptMsg = [
    ...History,
    {
      role: "user",
      parts: [{ text: msg }],
    },
  ];

  const answer = await main(promptMsg);

  // storing the model response + user questions in the history so that we can maintain the history
  History.push({ role: "user", parts: [{ text: msg }] });
  History.push({ role: "model", parts: [{ text: answer }] });

  res.send(answer);
});

app.listen(3000, () => {
  console.log("App is listening at 3000!");
});
