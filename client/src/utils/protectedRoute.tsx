interface ProtectedRouteProps {
  children: React.ReactElement;
}
import { useAuthStore } from "../store";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated === false) {
    console.log(isAuthenticated)
    return <Navigate to="/login" />;
  } else {
    return children;
  }
};
