import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "@emotion/styled";

import Profile from "./profile/Profile";

const Header = styled(Box)`
  display: flex;
  background-color: #20bd61;
  gap: 10px;
  align-items: center;
`;

const InfoDrawer = ({ open, setOpen }) => {
  const handleClose = () => {
    if (setOpen === true) setOpen(false);
    setOpen(false);
  };
  return (
    <>
      <Drawer
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { width: "30%", height: "100vh", backgroundColor: "#F7F5F3" },
          },
        }}
      >
        <Header>
          <ArrowBackIcon onClick={handleClose} />
          <p>Profile</p>
        </Header>
        <Box>
          <Profile />
        </Box>
      </Drawer>
    </>
  );
};
export default InfoDrawer;
