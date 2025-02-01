import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [userData, setUserData] = useState(null);

    const login = (user) => {
        setUserData(user);
    };

    const logout = () => {
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
