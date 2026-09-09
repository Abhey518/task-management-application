import { createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

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
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthContext;

 