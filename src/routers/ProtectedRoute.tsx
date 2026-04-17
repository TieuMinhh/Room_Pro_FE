import { selectCurrentUser } from "@/store/slice/userSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
