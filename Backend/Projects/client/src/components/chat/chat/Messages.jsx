import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChatFooter from "./ChatFooter";

import { AccountContext } from "../../context/AccountProvider";
import { useContext } from "react";

const Wrapper = styled(Box)`
  background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-size: 50%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesArea = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const Message = ({ person }) => {
  const { account } = useContext(AccountContext);

  const sendText = (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      let message = {
        senderId: account.sub,
        recieverId: person.sub,
      };
    }
  };
  return (
    <Wrapper>
      <MessagesArea>
        {/* Yahan saare chat messages render honge */}
      </MessagesArea>
      <ChatFooter sendText={sendText} />
    </Wrapper>
  );
};

export default Message;
