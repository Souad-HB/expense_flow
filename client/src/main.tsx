import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Route, Routes } from "react-router-dom";

import App from "./App.tsx";
// import { Dashboard } from "./pages/Dashboard.tsx";
// import { Recurring } from "./pages/Recurring.tsx";
// import { Spending } from "./pages/Spending.tsx";
// import { Budget } from "./pages/Budget.tsx";
// import { Login } from "./pages/Login.tsx";
// import { Signup } from "./pages/Signup.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<App />}>
  //       {/* nested routes in App: */}
  //       <Route index element={<Dashboard />}></Route>
  //       <Route path="/spending" element={<Spending />}></Route>
  //       <Route path="/budget" element={<Budget />}></Route>
  //       <Route path="/recurring" element={<Recurring />}></Route>
  //       <Route path="/login" element={<Login />}></Route>
  //       <Route path="/singup" element={<Signup />}></Route>
  //     </Route>
  //   </Routes>
  // </BrowserRouter>
);
