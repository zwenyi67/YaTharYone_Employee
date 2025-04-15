import { createContext, useContext, useState, useEffect } from "react";
import { UserData } from "@/api/auth/types";

interface AuthContextType {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    // Listen for storage changes (when logging in/out)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("userData");
      setUserData(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserData must be used within an AuthProvider");
  }
  return context;
};
