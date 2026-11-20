import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChatHeader from "./ChatHeader";
import Message from "./Messages";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/AccountProvider";

import { getConversation } from "../../../services/api";

const Component = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 1050px;
`;

const ChatBox = () => {
  const { person, account } = useContext(AccountContext);

  useEffect(() => {
    const getConversationDetails = async () => {
      let data = await getConversation({
        senderId: account.sub,
        recieverId: person.sub,
      });
      console.log(data);
    };
    getConversationDetails();
  }, [person.sub]);

  return (
    <Component>
      <ChatHeader person={person} />
      <Message person={person} />
    </Component>
  );
};

export default ChatBox;
