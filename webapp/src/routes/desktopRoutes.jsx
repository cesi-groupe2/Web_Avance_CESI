import HomePage from "../desktop/pages/HomePage/HomePage";
import NotFound from "../desktop/pages/NotFound/NotFound";
import SignupPage from "../desktop/pages/SignupPage/SignupPage";
import LoginPage from "../desktop/pages/LoginPage/LoginPage";
import ForgotPassword from "../desktop/pages/ForgotPasswordPage/ForgotPasswordPage";
import PaymentForm from "../desktop/pages/PaymentPage/PaymentPage.jsx";

const desktopRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "*", element: <NotFound /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/payment", element: <PaymentPage /> },
];

export default desktopRoutes;
