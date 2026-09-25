const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Earth", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Venus", correct: false },
    ],
  },
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Berlin", correct: false },
      { text: "Madrid", correct: false },
      { text: "Paris", correct: true },
      { text: "Rome", correct: false },
    ],
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    answers: [
      { text: "Gold", correct: false },
      { text: "Oxygen", correct: true },
      { text: "Osmium", correct: false },
      { text: "Iron", correct: false },
    ],
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Vincent van Gogh", correct: false },
      { text: "Pablo Picasso", correct: false },
      { text: "Leonardo da Vinci", correct: true },
      { text: "Claude Monet", correct: false },
    ],
  },
  {
    question: "Which is the smallest continent?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Australia", correct: true },
      { text: "Europe", correct: false },
      { text: "Africa", correct: false },
    ],
  },
  {
    question: "How many colors are in a rainbow?",
    answers: [
      { text: "6", correct: false },
      { text: "8", correct: false },
      { text: "7", correct: true },
      { text: "5", correct: false },
    ],
  },
  {
    question: "What is the hardest natural substance on Earth?",
    answers: [
      { text: "Gold", correct: false },
      { text: "Iron", correct: false },
      { text: "Diamond", correct: true },
      { text: "Platinum", correct: false },
    ],
  },
  {
    question: "Which ocean is the largest?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
      { text: "Arctic Ocean", correct: false },
    ],
  },
  {
    question: "What is the square root of 64?",
    answers: [
      { text: "6", correct: false },
      { text: "7", correct: false },
      { text: "8", correct: true },
      { text: "9", correct: false },
    ],
  },
  {
    question: "In which country would you find the Great Pyramid of Giza?",
    answers: [
      { text: "Mexico", correct: false },
      { text: "Egypt", correct: true },
      { text: "Greece", correct: false },
      { text: "Italy", correct: false },
    ],
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    answers: [
      { text: "Oxygen", correct: false },
      { text: "Nitrogen", correct: false },
      { text: "Carbon Dioxide", correct: true },
      { text: "Hydrogen", correct: false },
    ],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: "Charles Dickens", correct: false },
      { text: "William Shakespeare", correct: true },
      { text: "Mark Twain", correct: false },
      { text: "Jane Austen", correct: false },
    ],
  },
  {
    question: "What is the currency of Japan?",
    answers: [
      { text: "Won", correct: false },
      { text: "Yuan", correct: false },
      { text: "Yen", correct: true },
      { text: "Dollar", correct: false },
    ],
  },
  {
    question: "Which organ pumps blood throughout the human body?",
    answers: [
      { text: "Lungs", correct: false },
      { text: "Brain", correct: false },
      { text: "Heart", correct: true },
      { text: "Liver", correct: false },
    ],
  },
  {
    question: "How many legs does a spider have?",
    answers: [
      { text: "6", correct: false },
      { text: "10", correct: false },
      { text: "8", correct: true },
      { text: "12", correct: false },
    ],
  },
  {
    question: "What is the freezing point of water?",
    answers: [
      { text: "10°C", correct: false },
      { text: "0°C", correct: true },
      { text: "100°C", correct: false },
      { text: "-5°C", correct: false },
    ],
  },
  {
    question: "Which is the fastest land animal?",
    answers: [
      { text: "Lion", correct: false },
      { text: "Horse", correct: false },
      { text: "Cheetah", correct: true },
      { text: "Eagle", correct: false },
    ],
  },
  {
    question: "What is the primary language spoken in Brazil?",
    answers: [
      { text: "Spanish", correct: false },
      { text: "English", correct: false },
      { text: "Portuguese", correct: true },
      { text: "French", correct: false },
    ],
  },
  {
    question: "Which metal is liquid at room temperature?",
    answers: [
      { text: "Silver", correct: false },
      { text: "Mercury", correct: true },
      { text: "Copper", correct: false },
      { text: "Aluminum", correct: false },
    ],
  },
  {
    question: "Who was the first person to walk on the moon?",
    answers: [
      { text: "Buzz Aldrin", correct: false },
      { text: "Neil Armstrong", correct: true },
      { text: "Yuri Gagarin", correct: false },
      { text: "John Glenn", correct: false },
    ],
  },
];

const questionsEl = document.getElementById("question");
const answerBtnEl = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("nextBtn");
const timeLeftEl = document.getElementById("time-left");

let currentQuestIndex = 0;
let score = 0;
let timer;
let timeLeft = 8;

function startQuiz() {
  currentQuestIndex = 0;
  score = 0;
  nextBtn.innerHTML = "Next";
  showQuestion();
}

function resetState() {
  clearInterval(timer);
  nextBtn.style.display = "none";
  while (answerBtnEl.firstChild) {
    answerBtnEl.removeChild(answerBtnEl.firstChild);
  }
}

function showQuestion() {
  resetState();
  let currrentQuestion = questions[currentQuestIndex];
  let questionNo = currentQuestIndex + 1;
  questionsEl.innerHTML = `${questionNo}. ${currrentQuestion.question}`;

  currrentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerBtnEl.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
  startTimer();
}

function startTimer() {
  timeLeft = 8;
  timeLeftEl.innerHTML = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.innerHTML = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  Array.from(answerBtnEl.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextBtn.style.display = "block";
}

function selectAnswer(e) {
  clearInterval(timer);
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerBtnEl.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextBtn.style.display = "block";
}

function showScore() {
  resetState();
  questionsEl.innerHTML = `Your score is ${score} out of ${questions.length}.`;
  nextBtn.innerHTML = "Play Again!";
  nextBtn.style.display = "block";
}

function handleNextButton() {
  currentQuestIndex++;
  if (currentQuestIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextBtn.addEventListener("click", () => {
  if (currentQuestIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

startQuiz();
