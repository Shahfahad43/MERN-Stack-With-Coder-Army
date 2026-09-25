import { useState, useRef } from "react";

function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const interRef = useRef(null);

  function start() {
    if (!isRunning) {
      interRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      setIsRunning(true);
    }
  }

  function stop() {
    clearInterval(interRef.current);
    interRef.current = null;
    setIsRunning(false);
  }

  function reset() {
    clearInterval(interRef.current);
    interRef.current = null;
    setTime(0);
    setIsRunning(false);
  }

  return (
    <>
      <h1>{time}</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export default StopWatch;
