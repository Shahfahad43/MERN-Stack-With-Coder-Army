import { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import formatDate from "../../utils/commons-utils";
import { AccountContext } from "../../context/AccountProvider";

const OwnMess = styled(Box)`
  background-color: #dcf8c6;
  padding: 6px 10px;
  max-width: 60%;
  width: fit-content;
  border-radius: 10px;
  margin-bottom: 8px;
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  word-break: break-word;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

const RecMess = styled(Box)`
  background-color: #ffffff;
  padding: 6px 10px;
  max-width: 60%;
  width: fit-content;
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  word-break: break-word;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

const TextMessage = styled(Typography)`
  font-size: 14px;
`;

const Time = styled(Typography)`
  font-size: 10px;
  color: #919191;
  white-space: nowrap;
  line-height: 1;
`;

const SingleMessages = ({ mess }) => {
  const { account } = useContext(AccountContext);

  return account?.sub === mess?.senderId ? (
    <OwnMess>
      <TextMessage variant="body2">{mess?.text}</TextMessage>
      <Time variant="caption">{formatDate(mess?.createdAt)}</Time>
    </OwnMess>
  ) : (
    <RecMess>
      <TextMessage variant="body2">{mess?.text}</TextMessage>
      <Time variant="caption">{formatDate(mess?.createdAt)}</Time>
    </RecMess>
  );
};

export default SingleMessages;
