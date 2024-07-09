import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./component/Landing";
import Signup from "./component/Signup";
import Login from "./component/Login";

import Dashboard from "./component/Dashboard";
import Otp from "./component/Otp";
import Info from "./component/Info";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
