import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChatFooter from "./ChatFooter";

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

const Message = () => {
  return (
    <Wrapper>
      <MessagesArea>
        {/* Yahan saare chat messages render honge */}
      </MessagesArea>
      <ChatFooter />
    </Wrapper>
  );
};

export default Message;
