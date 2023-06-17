import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import { authActions } from "../store/auth";

const RootLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      dispatch(authActions.logout());
      return;
    }

    const userDataValues = JSON.parse(userData);
    const { token, userId } = userDataValues;

    // Check token duration
    const storedTokenExpirationDate = userDataValues.expiration;
    const expirationDate = new Date(storedTokenExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    // console.log(duration);

    if (duration < 0) {
      navigate("/admin/login");
      localStorage.removeItem("userData");
      return;
    }

    dispatch(authActions.login({ token, userId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, dispatch]);

  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
