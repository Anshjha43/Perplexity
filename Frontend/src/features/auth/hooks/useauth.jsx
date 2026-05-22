import { useDispatch } from "react-redux";

import { register, login, getCurrentUser } from "../services/auth.api";
import { setuser, setLoading, setError, setCheckingAuth } from "../services/auth.slice";
export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true));
            const response = await register(username, email, password);
            console.log(response);
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false));
        }

    }


    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const response = await login(email, password);
            dispatch(setuser(response.user))
            console.log(response);
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
            console.log(error)
        } finally {
            dispatch(setLoading(false));
        }

    }

    async function handleCurrentuser() {
        try {
            dispatch(setCheckingAuth(true));

            const response = await getCurrentUser();

            console.log("Fetched user:", response.user);

            dispatch(setuser(response.user));
        } catch (error) {
            console.log("getme failed", error);

            dispatch(setuser(null));
            dispatch(setError(
                error.response?.data?.message ||
                "Failed to fetch current user"
            ));
        } finally {
            dispatch(setCheckingAuth(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleCurrentuser
    }

}


