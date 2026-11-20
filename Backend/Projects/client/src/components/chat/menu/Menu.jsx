import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddCommentIcon from "@mui/icons-material/AddComment";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Conversation from "./Conversation";

const Container = styled(Box)`
  width: 400px;
  min-height: 100vh;
  padding: 12px 16px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-right: 1px solid #e9edef;
`;

const TopMenu = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    color: #075e54;
    font-size: 23px;
    font-weight: 700;
    margin: 0;
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 18px;
    color: #54656f;
    cursor: pointer;
  }
`;

const TextInput = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  border-radius: 8px;
  margin-bottom: 20px;

  svg {
    color: #667781;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #111b21;
  }
`;

const Menu = () => {
  return (
    <Container>
      <TopMenu>
        <h2>WhatsApp</h2>

        <Box className="icons">
          <AddCommentIcon />
          <MoreVertIcon />
        </Box>
      </TopMenu>

      <TextInput>
        <SearchIcon />
        <input type="text" placeholder="Search or start a new chat" />
      </TextInput>

      <Box>
        <Conversation />
      </Box>
    </Container>
  );
};

export default Menu;
