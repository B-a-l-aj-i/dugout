"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
interface IdContextType {
  user: string;
  setUser: (id: string) => void;
}

interface User {
  id: string;
  real_name: string;
}

interface IdUsersContextType {
  users: User[]; // Corrected from string[] to User[]
  setUsers: (users: User[]) => void;
}

// Create the context with a default value
const userContext = createContext<IdContextType | undefined>(undefined);
const usersContext = createContext<IdUsersContextType | undefined>(undefined);

// Create a Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string>(""); // user is a string
  const [users, setUsers] = useState<User[]>([]); // Corrected from string[] to User[]

  return (
    <usersContext.Provider value={{ users, setUsers }}>
      <userContext.Provider value={{ user, setUser }}>
        {children}
      </userContext.Provider>
    </usersContext.Provider>
  );
};

// Custom hook for easier access to User context
export const UserContext = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// Custom hook for easier access to Users context
export const UsersContext = () => {
  const context = useContext(usersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within a UserProvider");
  }
  return context;
};
