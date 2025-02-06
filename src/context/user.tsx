"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
interface IdContextType {
  user: string;
  setUser: (id: string) => void;
}

// Create the context with a default value
const userContext = createContext<IdContextType | undefined>(undefined);

// Create a Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

// Custom hook for easier access
export const UserContext = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useIdContext must be used within an IdProvider");
  }
  return context;
};
