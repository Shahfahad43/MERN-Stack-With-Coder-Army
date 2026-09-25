import { useEffect, useState } from "react";

function GithubProfile({ username }) {
  const [profile, setProfile] = useState(null);

  async function getData() {
    if (!username) return;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getData();
  }, [username]);

  if (!profile || profile.message === "Not Found") {
    return username ? <p>User not found</p> : null;
  }

  return (
    <div className="card">
      <img src={profile.avatar_url} alt={profile.name} />
      <h2 id="userName">{profile.name || profile.login}</h2>
      <p id="userBio">{profile.bio}</p>
      <h3>Followers: {profile.followers}</h3>
      <h3>Following: {profile.following}</h3>
      <h3>Public Repos: {profile.public_repos}</h3>
      <a href={profile.html_url} target="_blank" rel="noreferrer">
        View on GitHub
      </a>
    </div>
  );
}

export default GithubProfile;
