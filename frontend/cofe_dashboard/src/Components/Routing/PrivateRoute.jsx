import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuth =
    sessionStorage.getItem("isLogin") || localStorage.getItem("isLogin");
  const location = useLocation();

  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: location }} />;
  }
};

export default PrivateRoute;
