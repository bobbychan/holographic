import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/home";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

export const routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/home" replace /> },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
    ],
  },
];
