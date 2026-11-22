import { useContext } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { AccountContext } from "../../context/AccountProvider"; // apna exact path rakhna

import { getConversation, setConversation } from "../../../services/api";

import { useState } from "react";
import { useEffect } from "react";
import formatDate from "../../utils/commons-utils";

const Component = styled(Box)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  gap: 14px;
  border-bottom: 1px solid #f0f2f5;

  &:hover {
    background-color: #f5f6f6;
  }
`;

const ContentWrapper = styled(Box)`
  width: 100%;
  overflow: hidden;
`;

const HeaderRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const UserName = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  color: #111b21;
`;

const TimeStamp = styled(Typography)`
  font-size: 12px;
  color: #667781;
  white-space: nowrap;
`;

const LastMessage = styled(Typography)`
  font-size: 14px;
  color: #667781;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 240px;
`;

const SingleConversations = ({ user }) => {
  const { setPerson, account, newMessageFlag } = useContext(AccountContext);

  const [message, setMessage] = useState({});

  useEffect(() => {
    const getConversationDetails = async () => {
      const data = await getConversation({
        senderId: account.sub,
        recieverId: user.sub,
      });
      setMessage({ text: data?.message, timestamp: data?.updatedAt });
    };

    if (account?.sub && user?.sub) {
      getConversationDetails();
    }
  }, [newMessageFlag, account?.sub, user?.sub]);

  const getUserMess = async () => {
    setPerson(user);
    await setConversation({ senderId: account.sub, recieverId: user.sub });
  };

  return (
    <Component onClick={getUserMess}>
      <Avatar src={user?.picture} alt={user?.name} />
      <ContentWrapper>
        <HeaderRow>
          <UserName>{user?.name}</UserName>
          {message?.text && (
            <TimeStamp>{formatDate(message?.timestamp)}</TimeStamp>
          )}
        </HeaderRow>
        <LastMessage>
          {message?.text?.includes("localhost") ? "media" : message?.text}
        </LastMessage>
      </ContentWrapper>
    </Component>
  );
};

export default SingleConversations;
