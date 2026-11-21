import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

// icons
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";

const Component = styled(Box)`
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
`;

const SearchBox = styled(Box)`
  background-color: #ffffff;
  border-radius: 18px;
  flex: 1;
  padding: 4px 16px;
`;

const InputField = styled(InputBase)`
  width: 100%;
  font-size: 14px;
`;

const ChatFooter = ({ sendText, setValue, value }) => {
  return (
    <Component>
      <IconButton>
        <TagFacesOutlinedIcon />
      </IconButton>
      <IconButton>
        <AttachFileIcon sx={{ transform: "rotate(40deg)" }} />
      </IconButton>
      <SearchBox>
        <InputField
          placeholder="Type a message"
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => sendText(e)}
          value={value}
        />
      </SearchBox>
      <IconButton>
        <KeyboardVoiceOutlinedIcon />
      </IconButton>
    </Component>
  );
};

export default ChatFooter;
