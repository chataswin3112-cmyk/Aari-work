import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/styles.css";
import { LandingPage } from "../src/landing/LandingPage";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Static app root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
);
