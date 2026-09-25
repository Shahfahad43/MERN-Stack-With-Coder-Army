import { useState, useEffect, useCallback } from "react";

function PasswordGenerator() {
  const [password, setPassword] = useState("ABCDE");
  const [length, setLength] = useState(10);
  const [changeNumber, setChangeNumber] = useState(false);
  const [changeCharacter, setChangeCharacter] = useState(false);

  const generatePass = useCallback(() => {
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (changeNumber) {
      str += "0123456789";
    }
    if (changeCharacter) {
      str += "!@#$%^&*(){}";
    }

    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += str[Math.floor(Math.random() * str.length)];
    }

    setPassword(pass);
  }, [length, changeCharacter, changeNumber]);

  useEffect(() => {
    generatePass();
  }, [length, changeCharacter, changeNumber, generatePass]);

  return (
    <>
      <h1>Password: {password}</h1>
      <input
        type="range"
        min={5}
        max={20}
        value={length}
        onChange={(e) => setLength(e.target.value)}
      />
      <label>Length: {length}</label>

      <input type="checkbox" onChange={() => setChangeNumber(!changeNumber)} />
      <label>Number</label>

      <input
        type="checkbox"
        onChange={() => setChangeCharacter(!changeCharacter)}
      />
      <label>Character</label>
    </>
  );
}

export default PasswordGenerator;
