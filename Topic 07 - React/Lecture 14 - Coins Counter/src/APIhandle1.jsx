// How to handle an API normally in React?

import { useEffect, useState } from "react";

function HandleAPI() {
  const [state, updateState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://api.github.com/users");
        const data = await response.json();
        updateState(data);
        console.log(data);
      } catch (error) {
        console.log("Error while fetching data ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      {state.map((data) => {
        <h1 key={data.id}>{data.login}</h1>;
      })}
    </>
  );
}

export default HandleAPI;
