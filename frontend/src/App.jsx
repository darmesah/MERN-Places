import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import RootLayout from "./pages/Root";
import Error from "./pages/Error";
import Users, { loader as usersLoader } from "./pages/User/Users/Users";
import NewPlace from "./pages/Places/NewPlace/NewPlace";
// import UserPlaces, {
//   loader as userPlacesLoader,
//   action as deletePlaceAction,
// } from './pages/Places/UserPlaces/UserPlaces';
import UpdatePlace, {
  loader as updatePlaceLoader,
  action as updatePlaceAction,
} from "./pages/Places/UpdatePlace/UpdatePlace";
import Auth from "./pages/User/Auth/Auth";
import { lazy, Suspense } from "react";

const UserPlaces = lazy(() => import("./pages/Places/UserPlaces/UserPlaces"));

const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          errorElement: <Error />,
          children: [
            { index: true, element: <Users />, loader: usersLoader },
            { path: "auth", element: <Auth /> },
            {
              path: ":userId/places",
              element: (
                <Suspense fallback={<p>LOADING...</p>}>
                  <UserPlaces />
                </Suspense>
              ),
              loader: ({ params }) =>
                import("./pages/Places/UserPlaces/UserPlaces").then((module) =>
                  module.loader({ params })
                ),
              action: ({ params, request }) =>
                import("./pages/Places/UserPlaces/UserPlaces").then((module) =>
                  module.action({ params, request })
                ),
            },
            {
              path: "places/new",
              element: isAuth ? (
                <NewPlace />
              ) : (
                <Navigate to="/auth" replace="true" />
              ),
            },
            {
              path: "places/:placeId",
              element: isAuth ? (
                <UpdatePlace />
              ) : (
                <Navigate to="/auth" replace="true" />
              ),
              loader: updatePlaceLoader,
              action: updatePlaceAction,
            },
          ],
        },
      ])}
    />
  );
};

export default App;
