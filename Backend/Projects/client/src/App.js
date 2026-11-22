// components
import Messenger from "./components/Messenger";
import AccountProvider from "./components/context/AccountProvider";

import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId =
    "1026630977196-lk210n6r5q2mihkt83q1d3plktb30ned.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AccountProvider>
        <Messenger />
      </AccountProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
