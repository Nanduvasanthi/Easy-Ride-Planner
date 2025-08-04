import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ClerkWithRoutes } from "./clerkProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkWithRoutes>
        <App />
      </ClerkWithRoutes>
    </BrowserRouter>
  </React.StrictMode>
);
