import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [userData, setUserData] = useState();

    const login = (user) => {
        setUserData(user);
    };

    const logout = () => {
        setUserData(null);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
