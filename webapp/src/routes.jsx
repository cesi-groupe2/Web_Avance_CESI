import { createBrowserRouter } from "react-router-dom";
import WebPageDAccueil from "./pages/HomePage/HomePage";
import NotFound from "./pages/NotFound/NotFound";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgotPassword from "./pages/ForgotPasswordPage/ForgotPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebPageDAccueil />,
  },
  {
    path: "*",
    element: <NotFound />, // Gestion de la page 404
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

export default router;
