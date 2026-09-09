import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreUser = async () => {

            if(!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get("/auth/me");

                setUser(response.data.user);

            } catch {
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");

            } finally {
                setIsLoading(false);

            }
        };

        restoreUser();
    }, [token]);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);

    };

    // Clear everything on logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{user, token, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthContext;

 