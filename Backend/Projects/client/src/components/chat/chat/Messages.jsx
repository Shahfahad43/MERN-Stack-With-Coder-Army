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
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [incomingMessage, setIncomingMessage] = useState(null);

  const { account, socket, newMessageFlag, setNewMessageFlag } =
    useContext(AccountContext);

  useEffect(() => {
    const handleGetMessage = (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now(),
      });
    };

    socket.current?.on("getMessage", handleGetMessage);

    return () => {
      socket.current?.off("getMessage", handleGetMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (
      incomingMessage &&
      conversation?.members?.includes(incomingMessage.senderId)
    ) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, conversation]);

  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessages(conversation._id);
      setMessages(data);
    };

    conversation?._id && getMessageDetails();
  }, [person?._id, conversation?._id, newMessageFlag]);

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

      socket.current.emit("sendMessage", message);

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
          messages.map((mess, index) => (
            <SingleMessages key={mess._id || index} mess={mess} />
          ))}
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
