import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App/App.js"
import Register from "./Register/Register.js";
import Login from "./Login/login.js";
import Users from "./Users/Users.js";
import Description from "./Description/description.js";
import Supplements from "./Supplements/supplements.js";
import Included from "./What's Included/Included.js";
import Memberships from "./Memberships/Memberships.js";
import Checkout from "./Supplements/Checkout.js";
import Admin from "./Admin/Admin.js";
import Reviews from "./Reviews/Reviews.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Ratings from "./Ratings/Ratings.js";

const rootElement = document.getElementById("root");
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/user",
    element: <Users />,
  },
  {
    path: "/user/supplements",
    element: <Supplements/>
  },
  {
    path: "/description",
    element: <Description />,
  },
  {
    path: "/included",
    element: <Included />,
  },
  {
    path: "/user/memberships",
    element: <Memberships />,
  },
  {
    path: "/user/supplements/checkout",
    element: <Checkout/>,
  },
  {
    path : "/admin",
    element: <Admin/>
  },
  {
    path: "/ratings",
    element: <Ratings/>
  },
  {
    path: "/reviews",
    element : <Reviews/>
  }
]);


ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);