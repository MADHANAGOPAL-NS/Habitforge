import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import {Routes, Route, Navigate} from "react-router-dom";
function App(){
  return(
    <Routes>
      
      <Route path = "/" element = {<Navigate to = "/login"></Navigate>}></Route>

      <Route path = "/login" element = {<Login></Login>}></Route>

      <Route path = "/register" element = {<Register></Register>}></Route>

      <Route path = "/dashboard" element = {<Dashboard></Dashboard>}></Route>
    </Routes>
  );
}

export default App;