import { Link, Outlet } from "react-router";

export default function Nav() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/details">Details</Link>
      </nav>

      <hr />

      <Outlet />
    </>
  );
}
