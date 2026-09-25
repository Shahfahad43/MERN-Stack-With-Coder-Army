// Creating nested elements in React - manually
const rootEl = document.getElementById("root");

const mainContainer = React.createElement(
  "div",
  { id: "container" },
  React.createElement(
    "ul",
    { id: "list" },
    React.createElement("li", { id: "listItem" }, "I am the first list item."),
    React.createElement("li", { id: "listItem" }, "I am the second list item."),
    React.createElement("li", { id: "listItem" }, "I am the third list item."),
    React.createElement("li", { id: "listItem" }, "I am the fourth list item."),
  ),
);

const root = ReactDOM.createRoot(rootEl);

root.render(mainContainer);

// But this method is not recommended and is not valid. We have to write the code of HTML in JS so that to get the work more efficient and in
// an easier way.
