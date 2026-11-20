import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Sidebar from "./sidebar/Siderbar";
import Menu from "./menu/Menu";
import EmptyPage from "./chat/EmptyPage";

const Container = styled(Box)`
  display: flex;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;

  background-color: #eae6df;
  overflow: hidden;

  & > * {
    height: 100%;
    min-height: 0;
  }
`;

const ChatDialogue = () => {
  return (
    <>
      <Container>
        <Box>
          <Sidebar />
        </Box>
        <Box>
          <Menu />
        </Box>
        <Box>
          <EmptyPage />
        </Box>
      </Container>
    </>
  );
};

export default ChatDialogue;
