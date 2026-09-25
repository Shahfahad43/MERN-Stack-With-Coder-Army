// Creating an element
const h1 = React.createElement("h1", {}, "Hello React");

// Getting the root element
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);

// rendering the element
root.render(h1);
