const rootEl = document.getElementById("root");
const bodyEl = document.body;
rootEl.addEventListener("click", (event) => {
  bodyEl.style.backgroundColor = event.target.id;
});
