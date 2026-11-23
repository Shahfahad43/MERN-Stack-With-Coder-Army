import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import EditDocumentIcon from "@mui/icons-material/EditDocument";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";

import { emptyChatImage } from "../../../constants/data";

const Container = styled(Box)`
  background-color: #f8fafb;
  height: 100vh;
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 20px;
  text-align: center;
`;

const Image = styled("img")`
  width: 100%;
  max-width: 400px;
  height: auto;
`;

const IconsBox = styled(Box)`
  display: flex;
  gap: 32px;
  color: #393737;
  & > svg {
    font-size: 32px;
  }
`;

const Title = styled(Typography)`
  color: #41525d;
  font-weight: 400;
  font-size: 32px;
  margin-top: 8px;
`;

const SubText = styled(Typography)`
  color: #667781;
  font-size: 14px;
  max-width: 420px;
`;

const EmptyPage = () => {
  return (
    <Container>
      <Image src={emptyChatImage} alt="No chat selected" />

      <Title variant="h4">WhatsApp Web</Title>

      <SubText>
        Send and receive messages without keeping your phone online.
        <br />
        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
      </SubText>

      <IconsBox>
        <EditDocumentIcon />
        <PermContactCalendarIcon />
        <EmailIcon />
        <CallIcon />
      </IconsBox>

      <SubText
        sx={{ fontSize: 12, display: "flex", alignItems: "center", gap: 1 }}
      >
        🔒 End-to-end encrypted
      </SubText>
    </Container>
  );
};

export default EmptyPage;
