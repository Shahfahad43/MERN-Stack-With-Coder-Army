import { useState } from "react";
import GithubProfile from "./components/Body.js";

export default function App() {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(input);
  };

  return (
    <div>
      <div className="searchBtn">
        <h1 id="heading">GitHub User Search</h1>
        <div className="input">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSearch}>Get Profile</button>
        </div>
      </div>

      <GithubProfile username={searchQuery} />
    </div>
  );
}
