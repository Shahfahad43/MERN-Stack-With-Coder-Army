const buttons = document.querySelectorAll("button");
const display = document.getElementById("input");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    let value = button.innerText;

    if (value === "AC") {
      display.innerText = "0";
    } else if (value === "DEL") {
      if (display.innerText.length === 1 || display.innerText === "0") {
        display.innerText = "0";
      } else {
        display.innerText = display.innerText.slice(0, -1);
      }
    }
    // 1. Handle the "=" button
    else if (value === "=") {
      try {
        display.innerText = eval(display.innerText);
      } catch {
        display.innerText = "Error";
      }
    } else {
      if (display.innerText === "0") {
        display.innerText = value;
      } else {
        display.innerText += value;
      }
    }
  });
});
