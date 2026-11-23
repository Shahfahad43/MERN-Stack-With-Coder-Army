import { useEffect, useState, useContext } from "react";
import { getUsers } from "../../../services/api";
import Box from "@mui/material/Box";
import SingleConversations from "./SingleConversations";
import { AccountContext } from "../../context/AccountProvider";

const Conversation = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { account, socket, setActiveUsers, setNewMessageFlag } =
    useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setUsers(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(err.message || "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!account?.sub || !socket.current) return;

    socket.current.emit("addUsers", account);

    const handleGetUsers = (users) => {
      setActiveUsers(users);
    };

    const handleSidebarMessage = () => {
      setNewMessageFlag((prev) => !prev);
    };

    socket.current.on("getUsers", handleGetUsers);
    socket.current.on("getMessage", handleSidebarMessage);

    return () => {
      socket.current?.off("getUsers", handleGetUsers);
      socket.current?.off("getMessage", handleSidebarMessage);
    };
  }, [account, socket, setActiveUsers, setNewMessageFlag]);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box>
      {users.length === 0 ? (
        <Box>No users found</Box>
      ) : (
        users
          .filter((user) => user.sub !== account.sub)
          .map((user) => <SingleConversations key={user._id} user={user} />)
      )}
    </Box>
  );
};

export default Conversation;
