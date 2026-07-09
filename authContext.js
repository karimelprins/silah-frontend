// authContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const USERS_KEY = "SILAH_USERS";
const CURRENT_USER_KEY = "SILAH_CURRENT_USER";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, email }
  const [users, setUsers] = useState([]); // array of user objects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rawUsers = await AsyncStorage.getItem(USERS_KEY);
        setUsers(rawUsers ? JSON.parse(rawUsers) : []);

        const rawCurrent = await AsyncStorage.getItem(CURRENT_USER_KEY);
        setUser(rawCurrent ? JSON.parse(rawCurrent) : null);
      } catch (e) {
        console.warn("Failed to load auth storage", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistUsers = async (nextUsers) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
      setUsers(nextUsers);
    } catch (e) {
      console.warn("Failed to persist users", e);
    }
  };

  const persistCurrentUser = async (nextUser) => {
    try {
      if (nextUser) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
      } else {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }
      setUser(nextUser);
    } catch (e) {
      console.warn("Failed persist current user", e);
    }
  };

  const register = async (username, email, password) => {
    if (!username) return { success: false, message: "Username required" };
    if (users.some(u => u.username === username)) return { success: false, message: "Username already exists" };

    const next = [...users, { username, email, password }];
    await persistUsers(next);
    await persistCurrentUser({ username, email });
    return { success: true, message: "Registered successfully" };
  };

  const login = async (username) => {
    const found = users.find(u => u.username === username);
    if (!found) return { success: false, message: "User not registered" };

    await persistCurrentUser(found);
    return { success: true };
  };

  const logout = async () => {
    await persistCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, users, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
