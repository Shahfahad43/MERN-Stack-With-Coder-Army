import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [color, setColor] = useState("black");

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return (
    <>
      <div className="buttonsContainer">
        <h1>Backgroud Color Changer</h1>
        <button onClick={() => setColor("red")}>Red</button>
        <button onClick={() => setColor("blue")}>Blue</button>
        <button onClick={() => setColor("green")}>Green</button>
        <button onClick={() => setColor("yellow")}>Yellow</button>
      </div>
    </>
  );
}

export default App;
