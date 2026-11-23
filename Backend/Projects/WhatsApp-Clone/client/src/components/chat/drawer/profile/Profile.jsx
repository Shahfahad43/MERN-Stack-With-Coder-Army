import { useContext } from "react";
import { AccountContext } from "../../../context/AccountProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

const Profile = () => {
  const { account } = useContext(AccountContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        py: 4,
        gap: 1.5,
      }}
    >
      <Avatar
        src={account.picture}
        alt={account.name}
        sx={{ width: 140, height: 140, boxShadow: 2 }}
      />

      <Typography variant="h6" fontWeight={600}>
        {account.name}
      </Typography>

      <Divider flexItem sx={{ my: 2 }} />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.6, fontStyle: "italic" }}
      >
        “You are born to serve humanity, not to eat, play and sleep!”
      </Typography>

      <Divider flexItem sx={{ my: 2 }} />

      <Button fullWidth variant="outlined" size="small">
        Edit Profile
      </Button>

      <Button fullWidth variant="text" size="small" color="error">
        Log out
      </Button>
    </Box>
  );
};

export default Profile;
