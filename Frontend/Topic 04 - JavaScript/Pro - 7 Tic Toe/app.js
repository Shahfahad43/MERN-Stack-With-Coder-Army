const container = document.querySelector(".boxContainer");
let turn = "O";
let totalTurn = 0;

let tictactoe = new Array(9).fill("E");

let winners = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function checkWinner() {
  for (let [index0, index1, index2] of winners) {
    if (
      tictactoe[index0] != "E" &&
      tictactoe[index0] === tictactoe[index1] &&
      tictactoe[index1] === tictactoe[index2]
    )
      return 1;
  }
  return 0;
}

const boardLogic = (e) => {
  if (tictactoe[e.target.id] === "E") {
    totalTurn++;
    if (turn === "O") {
      e.target.innerHTML = "O";
      tictactoe[e.target.id] = "O";
      document.getElementById("image1").style.transform = "scale(1.3)";
      document.getElementById("image2").style.transform = "scale(1)";
      if (checkWinner()) {
        document.getElementById("result").innerText = "Winner is O";
        container.removeEventListener("click", boardLogic);
      }
      turn = "x";
    } else {
      e.target.innerHTML = "X";
      tictactoe[e.target.id] = "X";
      document.getElementById("image1").style.transform = "scale(1)";
      document.getElementById("image2").style.transform = "scale(1.3)";
      if (checkWinner()) {
        document.getElementById("result").innerText = "Winner is X";
        container.removeEventListener("click", boardLogic);
      }

      turn = "O";
    }
    if (totalTurn === 9) {
      document.getElementById("result").innerText = "Game is Draw!";
      container.removeEventListener("click", boardLogic);
      document.getElementById("image1").style.transform = "scale(1)";
      document.getElementById("image2").style.transform = "scale(1)";
    }
  }
};

container.addEventListener("click", boardLogic);

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  let boxes = document.getElementsByClassName("box");
  Array.from(boxes).forEach((box) => {
    box.innerHTML = "";
  });
  turn = "O";
  totalTurn = 0;
  tictactoe = new Array(9).fill("E");
  container.addEventListener("click", boardLogic);
  document.getElementById("result").textContent = " ";
  document.getElementById("image1").style.transform = "scale(1)";
  document.getElementById("image2").style.transform = "scale(1)";
});
