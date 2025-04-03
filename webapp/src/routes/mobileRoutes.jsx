import HomePageMobile from "../mobile/pages/HomePageMobile/HomePageMobile";
import HomePageConnectedMobile from "../mobile/pages/HomePageConnectedMobile/HomePageConnectedMobile";
// import NotFoundMobile from "../mobile/pages/NotFoundMobile/NotFoundMobile";
import SignupPageMobile from "../mobile/pages/SignupPageMobile/SignupPageMobile";
import LoginPageMobile from "../mobile/pages/LoginPageMobile/LoginPageMobile";
import ForgotPasswordMobile from "../mobile/pages/ForgotPasswordPageMobile/ForgotPasswordPageMobile";

const mobileRoutes = [
  { path: "/", element: <HomePageMobile /> },
  { path: "/home", element: <HomePageConnectedMobile /> },
  // { path: "*", element: <NotFoundMobile /> },
  { path: "/signup", element: <SignupPageMobile /> },
  { path: "/login", element: <LoginPageMobile /> },
  { path: "/forgot-password", element: <ForgotPasswordMobile /> },
];

export default mobileRoutes;
