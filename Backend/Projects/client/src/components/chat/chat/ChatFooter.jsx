import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

// icons
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import SendIcon from "@mui/icons-material/Send";
import { useEffect } from "react";

import { uploadFile } from "../../../services/api";

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

const SendButton = styled(IconButton)`
  color: #54656f;
  transition:
    transform 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: #00a884;
    transform: scale(1.08);
  }
`;

const ChatFooter = ({ sendText, setValue, value, file, setFile, setImage }) => {
  useEffect(() => {
    const getFile = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        const response = await uploadFile(data);
        setImage(response.data);
      }
    };
    getFile();
  }, [file, setImage]);

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setValue(e.target.files[0].name);
    }
  };

  // Send button par click karne se bhi Enter key wala same sendText trigger ho:
  const handleSendClick = () => {
    if (value?.trim() || file) {
      sendText({ key: "Enter", keyCode: 13 });
    }
  };

  const hasTextOrFile = Boolean(value?.trim() || file);

  return (
    <Component>
      <IconButton>
        <TagFacesOutlinedIcon />
      </IconButton>

      <label htmlFor="fileInput">
        <IconButton component="span">
          <AttachFileIcon sx={{ transform: "rotate(40deg)" }} />
        </IconButton>
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <SearchBox>
        <InputField
          placeholder="Type a message"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && hasTextOrFile) {
              sendText(e);
            }
          }}
          value={value}
        />
      </SearchBox>

      {hasTextOrFile ? (
        <SendButton onClick={handleSendClick}>
          <SendIcon />
        </SendButton>
      ) : (
        <IconButton>
          <KeyboardVoiceOutlinedIcon />
        </IconButton>
      )}
    </Component>
  );
};

export default ChatFooter;
