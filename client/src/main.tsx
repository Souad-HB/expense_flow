import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import App from "./App.tsx";
import { Login } from "./pages/Login.tsx";
import { Signup } from "./pages/Signup.tsx";
import { ProtectedRoute } from "./utils/protectedRoute.tsx";
import { OnBoarding } from "./pages/OnBoarding.tsx";
import { Landing } from "./pages/Landing.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />}></Route>
          {/* nested routes in App: */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>

          {/* protected routes: */}
          <Route
            path="/onboard"
            element={
              <ProtectedRoute>
                <OnBoarding />
              </ProtectedRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
