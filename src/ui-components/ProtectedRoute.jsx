import { Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import adminList from "../adminList"; // Import admin list

const ProtectedRoute = ({ children }) => {
  const { accounts } = useMsal();
  const isAdmin = accounts[0] && adminList.includes(accounts[0]?.username);

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
