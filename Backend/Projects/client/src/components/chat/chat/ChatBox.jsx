import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChatHeader from "./ChatHeader";
import Message from "./Messages";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";

const Component = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 1050px;
`;

const ChatBox = () => {
  const { person } = useContext(AccountContext);
  return (
    <Component>
      <ChatHeader person={person} />
      <Message person={person} />
    </Component>
  );
};

export default ChatBox;
