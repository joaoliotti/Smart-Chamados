import { Routes, Route } from "react-router-dom";
import SignIn from "../app/pages/auth/SignIn/SignIn";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
        </Routes>
    )
}

export default AppRoutes;