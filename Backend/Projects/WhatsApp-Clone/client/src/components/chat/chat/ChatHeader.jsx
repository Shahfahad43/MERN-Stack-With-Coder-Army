import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

// icons
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";

const ChatHeader = ({ person }) => {
  const { activeUsers } = useContext(AccountContext);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        bgcolor: "#f0f2f5",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* Left Side: User Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar src={person.picture} alt="User name" />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, lineHeight: 1.2 }}
          >
            {person.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activeUsers?.find((user) => user.sub === person.sub)
              ? "Online"
              : "Offline"}
          </Typography>
        </Box>
      </Box>

      {/* Right Side: Action Icons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton>
          <VideocamIcon />
        </IconButton>
        <IconButton>
          <CallIcon />
        </IconButton>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatHeader;
