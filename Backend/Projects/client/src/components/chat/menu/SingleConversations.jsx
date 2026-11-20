import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const Component = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& img": {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
  },
  "& p": {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const SingleConversations = ({ user }) => {
  return (
    <Component>
      <Box>
        <img src={user.picture} alt="dp" />
      </Box>
      <Box>
        <p>{user.name}</p>
      </Box>
    </Component>
  );
};

export default SingleConversations;
