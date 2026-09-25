// Creating
const root = document.getElementById("root");

// Normal JavaSript
const h1 = document.createElement("h1");
h1.innerText = "Hello World";

root.append(h1);

// Making the code efficient - need of React
const createElements = (tag, property, children) => {
  const element = document.createElement(tag);
  if (typeof children === "object") {
    for (const child of children) {
      element.append(child);
      console.log(typeof children);
    }
  } else {
    element.innerText = children;
  }
  for (let key in property) {
    element.style[key] = property[key];
  }
  return element;
};

const header = createElements(
  "h2",
  { backgroundColor: "blue", color: "white", fontSize: "25px" },
  "Hello React!",
);
const list1 = createElements("li", {}, "HTML");
const list2 = createElements("li", {}, "CSS");
const list3 = createElements("li", {}, "JS");
console.log(list1.innerText, list2.innerText, list3.innerText);

const ul = createElements("ul", {}, [list1, list2, list3]);

// Normal JS
// root.append(header);

const ReactDom = {
  render: function (element, root) {
    root.append(element);
  },
};

// Just like React
ReactDom.render(header, root);
ReactDom.render(ul, root);

// Normal JS
