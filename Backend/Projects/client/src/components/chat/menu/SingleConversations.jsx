import { useContext } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { AccountContext } from "../../context/AccountProvider"; // apna exact path rakhna

import { setConversation } from "../../../services/api";

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

const SingleConversations = ({ user }) => {
  const { setPerson, account } = useContext(AccountContext);

  const getUserMess = async () => {
    setPerson(user);
    await setConversation({ senderId: account.sub, recieverId: user.sub });
  };

  return (
    <Component onClick={getUserMess}>
      <Avatar src={user?.picture} alt={user?.name} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {user?.name}
        </Typography>
      </Box>
    </Component>
  );
};

export default SingleConversations;
