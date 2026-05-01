import { useState, useEffect } from "react";

function Body() {
  const [users, setUsers] = useState([]);

  async function getInformation() {
    try {
      const ran = Math.floor(Math.random() * 1000000);
      const response = await fetch(
        `https://api.github.com/users?since=${ran}&per_page=100`,
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log("Unable to run the program: ", error);
    }
  }

  useEffect(() => {
    getInformation();
  }, []);

  return (
    <div className="mainContainer">
      {users.map((user) => (
        <div className="card" key={user.id}>
          <img src={user.avatar_url} alt={user.login} />
          <h2>{user.login}</h2>
          <a href={user.html_url} target="_blank" rel="noreferrer">
            View Profile
          </a>
        </div>
      ))}
    </div>
  );
}

export default Body;
