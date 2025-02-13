// import { Outlet } from "react-router-dom";
import { Signup } from "./pages/Signup.js";
import { Login } from "./pages/Login.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> {/* Add later */}
      </Routes>
    </Router>
  );
}
export default App;
