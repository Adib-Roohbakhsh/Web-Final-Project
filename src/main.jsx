import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/Login/LoginPage";
import ProductPage from "./Pages/Product/ProductPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/productPage/:id", element: <ProductPage /> },
  { path: "/LoginPage", element: <LoginPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
