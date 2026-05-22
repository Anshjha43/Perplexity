import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function Protected({ children }) {
    const { user, checkingAuth } = useSelector((state) => state.auth);

    console.log("Protected:", user, checkingAuth);

    if (checkingAuth) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
