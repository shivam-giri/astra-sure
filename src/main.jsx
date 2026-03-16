import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WizardProvider } from "./context/WizardContext";
import { AppThemeProvider } from "./theme";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppThemeProvider>
    <AuthProvider>
      <WizardProvider>
        <App />
      </WizardProvider>
    </AuthProvider>
  </AppThemeProvider>
);