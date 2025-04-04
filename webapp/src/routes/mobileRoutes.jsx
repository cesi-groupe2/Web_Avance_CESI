import HomePageMobile from "../mobile/pages/HomePageMobile/HomePageMobile";
import HomePageConnectedMobile from "../mobile/pages/HomePageConnectedMobile/HomePageConnectedMobile";
import NotFound from "../desktop/pages/NotFound/NotFound";
import SignupPageMobile from "../mobile/pages/SignupPageMobile/SignupPageMobile";
import LoginPageMobile from "../mobile/pages/LoginPageMobile/LoginPageMobile";
import ForgotPasswordMobile from "../mobile/pages/ForgotPasswordPageMobile/ForgotPasswordPageMobile";
import RestaurantPageMobile from '../mobile/pages/RestaurantPageMobile/RestaurantPageMobile';

import HomeRestaurateurPageMobile from "../mobile/pages/HomeRestaurateurPageMobile/HomeRestaurateurPageMobile";
import MyRestaurantPageMobile from "../mobile/pages/MyRestaurantPageMobile/MyRestaurantPageMobile";
import AddArticlePageMobile from "../mobile/pages/AddArticlePageMobile/AddArticlePageMobile";

const mobileRoutes = [
  { path: "/", element: <HomePageMobile /> },
  { path: "/home", element: <HomePageConnectedMobile /> },
  { path: "*", element: <NotFound /> },
  { path: "/signup", element: <SignupPageMobile /> },
  { path: "/login", element: <LoginPageMobile /> },
  { path: "/forgot-password", element: <ForgotPasswordMobile /> },
  { path: '/restaurant/:id', element: <RestaurantPageMobile /> },
  { path: '/home-restaurateur', element: <HomeRestaurateurPageMobile /> },
  { path: '/my-restaurant', element: <MyRestaurantPageMobile /> },
  { path: '/add-article', element: <AddArticlePageMobile /> },
];

export default mobileRoutes;
