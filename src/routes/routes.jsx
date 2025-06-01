import { Routes, Route } from "react-router-dom";
import SignIn from "../app/pages/auth/SignIn/SignIn";
import Dashboard from "../app/pages/Dashboard/Dashboard";
import Private from "./Private";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />

            <Route path="/Dashboard" element={<Private><Dashboard/></Private>} />
        </Routes>
    )
}

export default AppRoutes;