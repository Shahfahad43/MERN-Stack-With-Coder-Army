const http = require("http");
const server = http.createServer((req, res) => {
  // res.end("Hello Shah Fahad");

  // You can also create routing using this:

  if (req.url === "/") {
    res.end("Hello Shah Fahad");
  } else if (req.url === "/contact") {
    res.end("This is the contact page.");
  } else if (req.url === "/about") {
    res.end("This is about page.");
  } else {
    res.end("Error: Page not found.");
  }
});

server.listen(4000, () => {
  console.log("I am listening at port 4000");
});
