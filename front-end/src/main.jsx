import React, { StrictMode } from 'react'; // Adicione esta linha
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";



import App from "./App.jsx";
import Home from "./pages/home/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  </StrictMode>,
);
