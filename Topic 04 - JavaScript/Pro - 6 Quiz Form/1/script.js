const correctAnswers = {
  q1: "Au",
  q2: "Mars",
  q3: "Leonardo da Vinci",
  q4: "Blue Whale",
  q5: "1945",
  q6: "Tokyo",
  q7: "Hydrogen",
  q8: "Diamond",
  q9: "7",
  q10: "Portuguese",
};

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = new FormData(form);

  let result = 0;

  for (let [key, value] of data.entries())
    if (value === correctAnswers[key]) result++;

  const out = document.getElementById("out");
  out.innerText = `Your score is ${result} out of 10.`;
});
