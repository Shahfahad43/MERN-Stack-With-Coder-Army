import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ChatFooter from "./ChatFooter";
import SingleMessages from "./SingleMessages";

import { AccountContext } from "../../context/AccountProvider";
import { useContext, useEffect, useState } from "react";

import { getMessages, newMessage } from "../../../services/api";

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

const Message = ({ person, conversation }) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessageFlag, setNewMessageFlag] = useState(false);
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  const { account } = useContext(AccountContext);

  useEffect(() => {
    const getMessagesDetail = async () => {
      const response = await getMessages(conversation._id);
      setMessages(response);
    };

    conversation?._id && getMessagesDetail();
  }, [conversation?._id, person?._id, newMessageFlag]);

  console.log(messages);

  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if (code === 13 || e.key === "Enter") {
      if (!conversation?._id) {
        console.log("Conversation ID abhi load nahi hui!");
        return;
      }

      let message = {};
      if (!file) {
        message = {
          senderId: account.sub,
          recieverId: person.sub,
          conversationId: conversation._id,
          type: "text",
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          recieverId: person.sub,
          conversationId: conversation._id,
          type: "file",
          text: image,
        };
      }

      await newMessage(message);
      setValue("");
      setFile("");
      setImage("");
      setNewMessageFlag((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      <MessagesArea>
        {messages &&
          messages.map((mess) => <SingleMessages key={mess._id} mess={mess} />)}
      </MessagesArea>
      <ChatFooter
        sendText={sendText}
        setValue={setValue}
        value={value}
        file={file}
        setFile={setFile}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default Message;
