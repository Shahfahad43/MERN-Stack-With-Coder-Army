document.body.addEventListener("click", (event) => {
  const circle = document.createElement("div");
  circle.className = "circle";
  circle.textContent = "Hi";

  // Position circle at click location (centered)
  const x = event.clientX;
  const y = event.clientY;
  circle.style.left = `${x - 25}px`;
  circle.style.top = `${y - 25}px`;

  // Random background color
  const colors = [
    "red",
    "blue",
    "orange",
    "green",
    "purple",
    "white",
    "yellow",
    "wheat",
    "pink",
    "cyan",
  ];
  circle.style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];

  document.body.appendChild(circle);

  // Remove circle after 5 seconds
  setTimeout(() => {
    circle.remove();
  }, 5000);
});
