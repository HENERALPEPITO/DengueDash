"use client";

import { MyUserInterface } from "@/interfaces/account/user-interface";
import { createContext, useState } from "react";

export const UserContext = createContext<{
  user: MyUserInterface | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}>({ user: null, setUser: () => {} });

import { ReactNode } from "react";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
