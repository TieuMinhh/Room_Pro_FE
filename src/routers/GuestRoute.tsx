import { selectCurrentUser } from "@/store/slice/userSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
  const currentUser = useSelector(selectCurrentUser);

  if (currentUser) {
    if (currentUser.role === "admin") {
      return <Navigate to="/dashboard" />;
    }
    if (currentUser.role === "owner") {
      return <Navigate to="/home-page" />;
    }
    if (currentUser.role === "tenant") {
      return <Navigate to="/tenant-rooms" />;
    }
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
