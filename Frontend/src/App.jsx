import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { useAuth } from "./features/auth/hooks/useauth";
import { router } from "./app.route";

const App = () => {
    const { handleCurrentuser } = useAuth();
    const { checkingAuth } = useSelector((state) => state.auth);

    useEffect(() => {
        handleCurrentuser();
    }, []);

    if (checkingAuth) {
        return <div>Loading...</div>;
    }

    return <RouterProvider router={router} />;
};

export default App;
