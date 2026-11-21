import { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// icons
import GetAppIcon from "@mui/icons-material/GetApp";

import formatDate from "../../utils/commons-utils";
import { AccountContext } from "../../context/AccountProvider";
import { downloadMedia } from "../../utils/commons-utils";

import { iconPDF } from "../../../constants/data";

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

const MediaContainer = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledImage = styled("img")({
  width: 600,
  maxWidth: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
  display: "block",
});

const PdfContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 4px;
  max-width: 280px;
`;

const DownloadIcon = styled(GetAppIcon)`
  border: 1px solid #919191;
  border-radius: 50%;
  padding: 3px;
  font-size: 20px;
  color: #54656f;
  cursor: pointer;
  font-size: 15px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const MediaFooter = styled(Box)`
  position: absolute;
  bottom: 6px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 2px 6px;
  border-radius: 12px;
`;

const SingleMessages = ({ mess }) => {
  const { account } = useContext(AccountContext);

  return account?.sub === mess?.senderId ? (
    <OwnMess>
      {mess.type === "file" ? (
        <ImageMess mess={mess} />
      ) : (
        <SimpleMessage mess={mess} />
      )}
    </OwnMess>
  ) : (
    <RecMess>
      {mess.type === "file" ? (
        <ImageMess mess={mess} />
      ) : (
        <SimpleMessage mess={mess} />
      )}
    </RecMess>
  );
};

const SimpleMessage = ({ mess }) => {
  return (
    <>
      <TextMessage variant="body2">{mess?.text}</TextMessage>
      <Time variant="caption">{formatDate(mess?.createdAt)}</Time>
    </>
  );
};

const ImageMess = ({ mess }) => {
  return (
    <MediaContainer>
      {mess?.text?.includes(".pdf") ? (
        <PdfContainer>
          <img src={iconPDF} alt="pdf" style={{ width: 38, height: 38 }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: "13px",
              wordBreak: "break-word",
              flex: 1,
            }}
          >
            {mess?.text?.split("/").pop()}
          </Typography>
          <DownloadIcon onClick={(e) => downloadMedia(e, mess?.text)} />
          <Time variant="caption">{formatDate(mess?.createdAt)}</Time>
        </PdfContainer>
      ) : (
        <>
          <StyledImage src={mess?.text} alt="attachment" />
          <MediaFooter>
            <DownloadIcon />
            <Time variant="caption">{formatDate(mess?.createdAt)}</Time>
          </MediaFooter>
        </>
      )}
    </MediaContainer>
  );
};

export default SingleMessages;
