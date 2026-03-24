import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Habits from "./Pages/Habits";
import Stats from "./Pages/Stats";
import { Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login"></Navigate>}></Route>

      <Route path="/login" element={<Login></Login>}></Route>

      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/stats" element={<Stats></Stats>} />
    </Routes>
  );
}

export default App;