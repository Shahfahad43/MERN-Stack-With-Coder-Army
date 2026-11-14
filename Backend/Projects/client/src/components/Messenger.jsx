// components
import LoginDialogue from "./accounts/LoginDialogue";

import { useContext } from "react";
import { AccountContext } from "./context/AccountProvider";
import ChatDialogue from "./chat/ChatDialogue";

const Messenger = () => {
  const { account } = useContext(AccountContext);
  return <div>{account ? <ChatDialogue /> : <LoginDialogue />}</div>;
};

export default Messenger;
