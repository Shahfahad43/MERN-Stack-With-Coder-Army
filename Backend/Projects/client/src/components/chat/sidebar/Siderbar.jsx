import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";

// Icons
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import SettingsIcon from "@mui/icons-material/Settings";

import InfoDrawer from "../drawer/InfoDrawer";

import { useState } from "react";

const Container = styled(Box)`
  width: 64px;
  height: 100vh;
  box-sizing: border-box;
  padding: 18px 0;
  background-color: #f7f5f3;
  border-right: 1px solid #e9edef;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  & > * {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  svg {
    color: #54656f;
    font-size: 23px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  svg:hover {
    color: #075e54;
  }
`;

const IconWrapper = styled(Box)`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e5e9e7;
  }
`;

const Avatar = styled("img")`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid #ffffff;
`;

const Sidebar = () => {
  const { account } = useContext(AccountContext);

  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(true);
  };
  return (
    <Container>
      <Box>
        <IconWrapper>
          <ChatIcon />
        </IconWrapper>

        <IconWrapper>
          <CallIcon />
        </IconWrapper>
      </Box>

      <Box>
        <IconWrapper>
          <SettingsIcon />
        </IconWrapper>

        <Avatar
          src={account?.picture}
          alt="Profile"
          onClick={() => toggleDrawer()}
        />
      </Box>
      <InfoDrawer open={openDrawer} setOpen={setOpenDrawer} />
    </Container>
  );
};

export default Sidebar;
