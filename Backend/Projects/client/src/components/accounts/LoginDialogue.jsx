// components
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";

import { qrCodeImage } from "../../constants/data";

const Component = styled(Box)`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fcf5eb;
`;

const Container = styled(Box)`
  display: flex;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px;
  gap: 30px;
  background-color: white;
`;

const LoginDialogue = () => {
  return (
    <>
      <Component>
        <Container>
          <Box>
            <h2>Scan to login</h2>
            <List>
              <ListItem>1. Scan the QR Code with your phone's camera</ListItem>
              <ListItem>2. Tap the link to open WhatsApp</ListItem>
              <ListItem>
                3. Scan the QR Code again to link your account
              </ListItem>
            </List>
          </Box>
          <Box>
            <img src={qrCodeImage} alt="qr-code-img" />
          </Box>
        </Container>
      </Component>
    </>
  );
};

export default LoginDialogue;
