import { BrowserRouter, Routes, Route } from "react-router";
import Nav from "./Nav";
import GithubUser from "./GithubUser";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />}>
            <Route index element={<h1>Hello</h1>} />
            <Route path="github/:name" element={<GithubUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
