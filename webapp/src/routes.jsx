import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import WebPageDAccueil from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebPageDAccueil />,
  },
  {
    path: "*",
    element: <NotFound />, // Gestion de la page 404
  },
]);

export default router;
