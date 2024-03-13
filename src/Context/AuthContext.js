import { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if(currentUser) {
      setIsLoading(false);
    } else {
      setCurrentUser(null);
    }

    return () => {};
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
