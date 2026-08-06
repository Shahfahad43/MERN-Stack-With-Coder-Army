import { useParams } from "react-router";
import { useState, useEffect } from "react";
function GithubUser() {
  const { name } = useParams();
  const [Profile, SetProfile] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await fetch(`https://api.github.com/users/${name}`);
      const user = await data.json();
      SetProfile(user);
    }
    fetchUser();
  }, [name]);

  return (
    <div>
      <h2>Github User</h2>
      <div>
        <img src={Profile?.avatar_url} alt={Profile?.login} />
        <h3>{Profile?.name}</h3>
        <p>{Profile?.bio}</p>
        <p>Followers: {Profile?.followers}</p>
      </div>
    </div>
  );
}

export default GithubUser;
