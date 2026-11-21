import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChatHeader from "./ChatHeader";
import Message from "./Messages";
import { useContext, useEffect, useState } from "react";
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
  const [conversation, setConversation] = useState({});

  useEffect(() => {
    const getConversationDetails = async () => {
      let data = await getConversation({
        senderId: account.sub,
        recieverId: person.sub,
      });

      // Agar conversation null hai (first time chat), toh pehle create karo:
      if (!data) {
        await setConversation({
          senderId: account.sub,
          recieverId: person.sub,
        });
        data = await getConversation({
          senderId: account.sub,
          recieverId: person.sub,
        });
      }

      setConversation(data);
    };

    person?.sub && getConversationDetails();
  }, [person?.sub]);

  return (
    <Component>
      <ChatHeader person={person} />
      <Message person={person} conversation={conversation} />
    </Component>
  );
};

export default ChatBox;
